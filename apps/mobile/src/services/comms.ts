import { Linking, Alert, Platform } from 'react-native';
import { whatsappDigits } from '@/types/crm';

export async function openPhoneDialer(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) {
    Alert.alert('No phone number', 'This lead does not have a phone number.');
    return false;
  }
  const url = `tel:${cleaned}`;
  const can = await Linking.canOpenURL(url);
  if (!can && Platform.OS === 'web') {
    Alert.alert('Calling unavailable', 'Phone calls are not available in the browser.');
    return false;
  }
  await Linking.openURL(url);
  return true;
}

export async function openWhatsApp(phone: string, name: string) {
  const digits = whatsappDigits(phone);
  if (!digits) {
    Alert.alert('No phone number', 'This lead does not have a WhatsApp number.');
    return false;
  }
  const message = encodeURIComponent(
    `Hi ${name.split(' ')[0] || name}, this is XpertPPC. Following up regarding your inquiry.`
  );
  const url = `https://wa.me/${digits}?text=${message}`;
  await Linking.openURL(url);
  return true;
}

export async function openEmailComposer(email: string, name: string) {
  if (!email || email.includes('@placeholder.local') || email.includes('@unknown.local')) {
    Alert.alert('No email', 'This lead does not have a usable email address.');
    return false;
  }
  const subject = encodeURIComponent('Following up on your XpertPPC inquiry');
  const body = encodeURIComponent(
    `Hi ${name.split(' ')[0] || name},\n\nThank you for reaching out to XpertPPC. I wanted to follow up on your inquiry.\n\nBest regards,\nXpertPPC`
  );
  const url = `mailto:${email}?subject=${subject}&body=${body}`;
  await Linking.openURL(url);
  return true;
}
