import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeFollowUp,
  fetchLead,
  markContacted,
  markReplied,
  setFollowUp,
  updateLead,
} from '@/api/leads';
import { openEmailComposer, openPhoneDialer, openWhatsApp } from '@/services/comms';
import { scheduleFollowUpReminder } from '@/services/notifications';
import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { NoteItem } from '@/components/NoteItem';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingState, ErrorState } from '@/components/EmptyState';
import { CRM_LEAD_STATUSES, LEAD_STATUS_LABELS, type CrmLeadStatus } from '@/types/crm';
import { ApiClientError } from '@/api/client';
import { colors, radius, shadows, spacing, typography } from '@/theme';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const [replyOpen, setReplyOpen] = useState(false);
  const [markOpen, setMarkOpen] = useState<'contacted' | 'replied' | null>(null);
  const [note, setNote] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpValue, setFollowUpValue] = useState('');

  const query = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => (await fetchLead(id!)).data,
    enabled: Boolean(id),
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['lead', id] });
    void qc.invalidateQueries({ queryKey: ['leads'] });
    void qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const contactMutation = useMutation({
    mutationFn: () => markContacted(id!, note || undefined),
    onSuccess: () => {
      setMarkOpen(null);
      setNote('');
      invalidate();
    },
  });

  const replyMutation = useMutation({
    mutationFn: (channel?: 'email' | 'whatsapp' | 'phone' | 'other') =>
      markReplied(id!, note || undefined, channel),
    onSuccess: () => {
      setMarkOpen(null);
      setReplyOpen(false);
      setNote('');
      invalidate();
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: CrmLeadStatus) => updateLead(id!, { status }),
    onSuccess: () => {
      setStatusOpen(false);
      invalidate();
    },
  });

  const followUpMutation = useMutation({
    mutationFn: async () => {
      const iso = followUpValue ? new Date(followUpValue).toISOString() : null;
      const res = await setFollowUp(id!, iso);
      if (iso && query.data?.lead) {
        await scheduleFollowUpReminder({
          leadId: id!,
          leadName: query.data.lead.name,
          when: new Date(iso),
        });
      }
      return res;
    },
    onSuccess: () => {
      setFollowUpOpen(false);
      invalidate();
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => completeFollowUp(id!),
    onSuccess: invalidate,
  });

  if (query.isLoading) return <LoadingState label="Loading lead…" />;
  if (query.isError || !query.data) {
    return (
      <ErrorState
        title="Could not load lead"
        message={query.error instanceof ApiClientError ? query.error.message : 'Lead not found.'}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const { lead, notes } = query.data;

  async function afterOpenChannel(channel: 'phone' | 'whatsapp' | 'email') {
    setReplyOpen(false);
    Alert.alert(
      'Did you reach them?',
      'Opening another app does not mark the lead automatically.',
      [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Mark contacted',
          onPress: () => {
            setMarkOpen('contacted');
          },
        },
        {
          text: 'Mark replied',
          onPress: () => {
            setMarkOpen('replied');
          },
        },
      ]
    );
    void channel;
  }

  return (
    <>
      <Stack.Screen options={{ title: lead.name }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{lead.name}</Text>
          {lead.businessName ? <Text style={styles.business}>{lead.businessName}</Text> : null}
          <StatusBadge status={lead.status} />
        </View>

        <View style={styles.actions}>
          <ActionButton
            icon="call-outline"
            label="Call"
            onPress={async () => {
              const ok = await openPhoneDialer(lead.phone);
              if (ok) await afterOpenChannel('phone');
            }}
          />
          <ActionButton
            icon="logo-whatsapp"
            label="WhatsApp"
            color="#128C7E"
            onPress={async () => {
              const ok = await openWhatsApp(lead.phone, lead.name);
              if (ok) await afterOpenChannel('whatsapp');
            }}
          />
          <ActionButton
            icon="mail-outline"
            label="Email"
            onPress={async () => {
              const ok = await openEmailComposer(lead.email, lead.name);
              if (ok) await afterOpenChannel('email');
            }}
          />
          <ActionButton icon="chatbubble-ellipses-outline" label="Reply" onPress={() => setReplyOpen(true)} />
        </View>

        <View style={styles.card}>
          <Row label="Phone" value={lead.phone || '—'} />
          <Row label="Email" value={lead.email || '—'} />
          <Row label="Source" value={lead.source || '—'} />
          <Row label="Message" value={lead.message || '—'} />
          <Row label="Replied" value={lead.replied ? 'Yes' : 'No'} />
          <Row label="Contacted" value={formatDate(lead.contactedAt)} />
          <Row label="Replied at" value={formatDate(lead.repliedAt)} />
          <Row label="Follow-up" value={formatDate(lead.followUpAt)} />
          <Row label="Created" value={formatDate(lead.createdAt)} />
          <Row label="Last synced" value={formatDate(lead.lastSyncedAt)} />
        </View>

        <View style={styles.rowBtns}>
          <Button title="Mark contacted" variant="secondary" onPress={() => setMarkOpen('contacted')} style={{ flex: 1 }} />
          <Button title="Mark replied" onPress={() => setMarkOpen('replied')} style={{ flex: 1 }} />
        </View>
        <View style={styles.rowBtns}>
          <Button title="Change status" variant="ghost" onPress={() => setStatusOpen(true)} style={{ flex: 1 }} />
          <Button title="Edit" variant="ghost" onPress={() => router.push({ pathname: '/leads/edit', params: { id: lead.id } })} style={{ flex: 1 }} />
        </View>
        <View style={styles.rowBtns}>
          <Button
            title="Set follow-up"
            variant="secondary"
            onPress={() => {
              setFollowUpValue(
                lead.followUpAt
                  ? new Date(lead.followUpAt).toISOString().slice(0, 16)
                  : new Date(Date.now() + 86400000).toISOString().slice(0, 16)
              );
              setFollowUpOpen(true);
            }}
            style={{ flex: 1 }}
          />
          {lead.followUpAt ? (
            <Button
              title="Complete follow-up"
              variant="ghost"
              loading={completeMutation.isPending}
              onPress={() => completeMutation.mutate()}
              style={{ flex: 1 }}
            />
          ) : null}
        </View>
        <Button
          title="Notes"
          variant="ghost"
          onPress={() => router.push({ pathname: '/leads/notes', params: { id: lead.id } })}
        />

        <Text style={styles.section}>Recent notes</Text>
        {notes.length === 0 ? (
          <Text style={styles.muted}>No notes yet.</Text>
        ) : (
          notes.slice(0, 3).map((n) => <NoteItem key={n.id} note={n} />)
        )}
      </ScrollView>

      <Modal visible={replyOpen} transparent animationType="slide" onRequestClose={() => setReplyOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setReplyOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Reply via</Text>
            <Button
              title="Phone"
              onPress={async () => {
                const ok = await openPhoneDialer(lead.phone);
                if (ok) await afterOpenChannel('phone');
              }}
            />
            <Button
              title="WhatsApp"
              onPress={async () => {
                const ok = await openWhatsApp(lead.phone, lead.name);
                if (ok) await afterOpenChannel('whatsapp');
              }}
            />
            <Button
              title="Email"
              onPress={async () => {
                const ok = await openEmailComposer(lead.email, lead.name);
                if (ok) await afterOpenChannel('email');
              }}
            />
            <Button title="Cancel" variant="ghost" onPress={() => setReplyOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={Boolean(markOpen)} transparent animationType="fade" onRequestClose={() => setMarkOpen(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMarkOpen(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>
              {markOpen === 'replied' ? 'Mark as replied' : 'Mark as contacted'}
            </Text>
            <Text style={styles.muted}>
              Only confirm if you actually contacted them. Opening dialer/WhatsApp/email alone is not enough.
            </Text>
            <Input
              label="Optional note"
              value={note}
              onChangeText={setNote}
              multiline
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
            <Button
              title="Save"
              loading={contactMutation.isPending || replyMutation.isPending}
              onPress={() => {
                if (markOpen === 'replied') replyMutation.mutate('other');
                else contactMutation.mutate();
              }}
            />
            <Button title="Cancel" variant="ghost" onPress={() => setMarkOpen(null)} />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={statusOpen} transparent animationType="slide" onRequestClose={() => setStatusOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setStatusOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Change status</Text>
            {CRM_LEAD_STATUSES.map((s) => (
              <Button
                key={s}
                title={LEAD_STATUS_LABELS[s]}
                variant={lead.status === s ? 'primary' : 'ghost'}
                onPress={() => statusMutation.mutate(s)}
              />
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={followUpOpen} transparent animationType="fade" onRequestClose={() => setFollowUpOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFollowUpOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Follow-up</Text>
            <Input
              label="Date/time (YYYY-MM-DDTHH:mm)"
              value={followUpValue}
              onChangeText={setFollowUpValue}
              placeholder="2026-09-20T19:00"
              autoCapitalize="none"
            />
            <Button
              title="Save follow-up"
              loading={followUpMutation.isPending}
              onPress={() => followUpMutation.mutate()}
            />
            <Button
              title="Clear follow-up"
              variant="ghost"
              onPress={() => {
                setFollowUpValue('');
                followUpMutation.mutate();
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  header: { gap: spacing.sm },
  name: { ...typography.title, color: colors.text },
  business: { ...typography.body, color: colors.textSecondary },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    ...shadows.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  row: { gap: 2 },
  rowLabel: { ...typography.small, color: colors.textMuted, textTransform: 'uppercase' },
  rowValue: { ...typography.body, color: colors.text },
  rowBtns: { flexDirection: 'row', gap: spacing.sm },
  section: { ...typography.subtitle, color: colors.text, marginTop: spacing.sm },
  muted: { ...typography.body, color: colors.textMuted },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
    ...shadows.floating,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  sheetTitle: { ...typography.subtitle, color: colors.text },
});
