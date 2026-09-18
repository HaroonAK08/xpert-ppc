import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addNote, fetchLead } from '@/api/leads';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { NoteItem } from '@/components/NoteItem';
import { LoadingState, ErrorState, EmptyState } from '@/components/EmptyState';
import { ApiClientError } from '@/api/client';
import { colors, spacing } from '@/theme';

export default function NotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [text, setText] = useState('');

  const query = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => (await fetchLead(id!)).data,
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: () => addNote(id!, text.trim()),
    onSuccess: () => {
      setText('');
      void qc.invalidateQueries({ queryKey: ['lead', id] });
    },
  });

  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data) {
    return (
      <ErrorState
        message={query.error instanceof ApiClientError ? query.error.message : 'Unable to load notes'}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Notes' }} />
      <View style={styles.screen}>
        <View style={styles.composer}>
          <Input
            label="Add note"
            value={text}
            onChangeText={setText}
            multiline
            style={{ minHeight: 80, textAlignVertical: 'top' }}
            placeholder="Client interested in SEO package. Follow up Friday."
          />
          <Button
            title="Save note"
            loading={mutation.isPending}
            disabled={!text.trim()}
            onPress={() => mutation.mutate()}
          />
        </View>
        <FlatList
          data={query.data.notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <NoteItem note={item} />}
          ListEmptyComponent={
            <EmptyState title="No notes" message="Add the first note for this lead." />
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  composer: {
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  list: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
});
