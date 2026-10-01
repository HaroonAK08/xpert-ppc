import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLead, updateLead } from '@/api/leads';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingState, ErrorState } from '@/components/EmptyState';
import { ApiClientError } from '@/api/client';
import { colors, radius, spacing, typography } from '@/theme';

export default function EditLeadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => (await fetchLead(id!)).data,
    enabled: Boolean(id),
  });

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!query.data?.lead) return;
    const l = query.data.lead;
    setName(l.name);
    setBusinessName(l.businessName);
    setPhone(l.phone);
    setEmail(l.email.includes('@placeholder') || l.email.includes('@unknown') ? '' : l.email);
    setSource(l.source);
    setMessage(l.message);
    setNotes(l.notes);
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: () =>
      updateLead(id!, {
        name,
        businessName,
        phone,
        email,
        source,
        message,
        notes,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['lead', id] });
      void qc.invalidateQueries({ queryKey: ['leads'] });
      Alert.alert('Saved', 'Lead updated.');
      router.back();
    },
  });

  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) {
    return (
      <ErrorState
        message={query.error instanceof ApiClientError ? query.error.message : 'Lead not found'}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit lead' }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Business" value={businessName} onChangeText={setBusinessName} />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input label="Source" value={source} onChangeText={setSource} />
        <Input
          label="Message"
          value={message}
          onChangeText={setMessage}
          multiline
          style={{ minHeight: 90, textAlignVertical: 'top' }}
        />
        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ minHeight: 90, textAlignVertical: 'top' }}
        />
        {mutation.isError ? (
          <Text style={styles.error}>
            {mutation.error instanceof ApiClientError
              ? mutation.error.message
              : 'Could not update lead'}
          </Text>
        ) : null}
        <Button
          title="Save changes"
          loading={mutation.isPending}
          onPress={() => mutation.mutate()}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  error: {
    ...typography.caption,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
