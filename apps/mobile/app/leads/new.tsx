import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLead } from '@/api/leads';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ApiClientError } from '@/api/client';
import { colors, radius, spacing, typography } from '@/theme';

export default function NewLeadScreen() {
  const router = useRouter();
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('manual');
  const [message, setMessage] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      createLead({
        name: name.trim(),
        businessName: businessName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        source: source.trim() || 'manual',
        message: message.trim(),
      }),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: ['leads'] });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
      const leadId = res.data?.id;
      Alert.alert('Lead added', 'The lead is in your list.');
      if (leadId) router.replace(`/leads/${leadId}`);
      else router.back();
    },
  });

  const canSave = name.trim().length >= 2;

  return (
    <>
      <Stack.Screen options={{ title: 'Add lead' }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Name *"
          value={name}
          onChangeText={setName}
          autoComplete="name"
          placeholder="Full name"
        />
        <Input
          label="Clinic / company"
          value={businessName}
          onChangeText={setBusinessName}
          autoComplete="organization"
          placeholder="Clinic or company name"
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder="+92 300 1234567"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="name@email.com"
        />
        <Input
          label="Source"
          value={source}
          onChangeText={setSource}
          placeholder="manual"
        />
        <Input
          label="Message / notes"
          value={message}
          onChangeText={setMessage}
          multiline
          style={{ minHeight: 90, textAlignVertical: 'top' }}
          placeholder="Optional context"
        />
        {mutation.isError ? (
          <Text style={styles.error}>
            {mutation.error instanceof ApiClientError
              ? mutation.error.message
              : 'Could not create lead'}
          </Text>
        ) : null}
        <Button
          title="Add lead"
          loading={mutation.isPending}
          disabled={!canSave}
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
