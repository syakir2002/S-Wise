
import { router, useLocalSearchParams } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon, { type IconName } from '../../components/AppIcon';
import ProfileMenu from '../../components/ProfileMenu';

const StyledSafeAreaView = styled(SafeAreaView);

const colors = {
  background: '#F7F7F1',
  dark: '#1E2B24',
  muted: '#7D857E',
  line: '#E8EBE4',
  green: '#B8E779',
  paleGreen: '#E9F0E3',
};

const preferenceRows: {
  title: string;
  description: string;
  icon: IconName;
  initialValue: boolean;
}[] = [
  {
    title: 'Push notifications',
    description: 'Get important updates about your spending',
    icon: { ios: 'bell.badge.fill', android: 'notifications', web: 'notifications' },
    initialValue: true,
  },
  {
    title: 'Weekly summary',
    description: 'A quick recap of your weekly activity',
    icon: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
    initialValue: false,
  },
];

export default function SettingScreen() {
  const { view } = useLocalSearchParams<{ view?: string }>();
  const [preferences, setPreferences] = useState(
    Object.fromEntries(preferenceRows.map((row) => [row.title, row.initialValue])),
  );
  const [profile, setProfile] = useState({ name: '', email: '' });

  const showUnavailableMessage = (feature: string) => {
    Alert.alert(feature, `${feature} settings are not available yet.`);
  };

  const openProfileForm = () => {
    router.setParams({ view: 'profile' });
  };

  return (
    <StyledSafeAreaView className={"settings-safeArea"} edges={['top']}>
      <ScrollView
        className={"settings-screen"}
        contentContainerClassName={"settings-content"}
        showsVerticalScrollIndicator={false}>
        {view === 'profile' ? (
          <ProfileEditForm
            profile={profile}
            onBack={() => router.setParams({ view: undefined })}
            onSave={(updatedProfile) => {
              setProfile(updatedProfile);
              router.setParams({ view: undefined });
            }}
          />
        ) : (
          <>
        <View className={"settings-header"}>
          <View>
            <Text className={"settings-eyebrow"}>MAKE IT YOURS</Text>
            <Text className={"settings-title"}>Settings</Text>
            <Text className={"settings-description"}>Manage your account and preferences.</Text>
          </View>
          <ProfileMenu />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={openProfileForm}
          className={"settings-profileCard active:opacity-80 active:scale-[0.98]"}>
          <View className={"settings-avatar"}>
            <AppIcon
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              tintColor={colors.dark}
              size={22}
            />
          </View>
          <View className={"settings-profileInfo"}>
            <Text className={"settings-profileName"}>{profile.name || 'Your profile'}</Text>
            <Text className={"settings-profileDescription"}>
              {profile.email || 'Personal details and account info'}
            </Text>
          </View>
          <View className={"settings-profileArrow"}>
            <AppIcon
              name={{ ios: 'arrow.up.right', android: 'north_east', web: 'north_east' }}
              tintColor={colors.dark}
              size={16}
            />
          </View>
        </Pressable>

        <SettingsSection title="PREFERENCES">
          <Pressable
            accessibilityRole="button"
            onPress={() => showUnavailableMessage('Currency')}
            className={"settings-row settings-valueRow active:opacity-[0.72]"}>
            <SettingIcon
              name={{ ios: 'dollarsign', android: 'attach_money', web: 'attach_money' }}
            />
            <View className={"settings-rowText"}>
              <Text className={"settings-rowTitle"}>Currency</Text>
              <Text className={"settings-rowDescription"}>US Dollar (USD)</Text>
            </View>
            <AppIcon
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor="#A0A9A1"
              size={16}
            />
          </Pressable>
          <View className={"settings-rowDivider"} />
          {preferenceRows.map((row, index) => (
            <View key={row.title}>
              {index > 0 && <View className={"settings-rowDivider"} />}
              <View className={"settings-row"}>
                <SettingIcon name={row.icon} />
                <View className={"settings-rowText"}>
                  <Text className={"settings-rowTitle"}>{row.title}</Text>
                  <Text className={"settings-rowDescription"}>{row.description}</Text>
                </View>
                <Pressable
                  accessibilityRole="switch"
                  accessibilityLabel={row.title}
                  accessibilityState={{ checked: preferences[row.title] }}
                  onPress={() =>
                    setPreferences((current) => ({
                      ...current,
                      [row.title]: !current[row.title],
                    }))
                  }
                  className={["settings-toggle", (preferences[row.title] ? "settings-toggleOn" : "")].filter(Boolean).join(' ')}>
                  <View
                    className={["settings-toggleKnob", (preferences[row.title] ? "settings-toggleKnobOn" : "")].filter(Boolean).join(' ')}
                  />
                </Pressable>
              </View>
            </View>
          ))}
        </SettingsSection>

        <SettingsSection title="ACCOUNT">
          <SettingsLink
            icon={{ ios: 'lock.shield.fill', android: 'security', web: 'security' }}
            title="Privacy & security"
            description="Keep your account safe"
            onPress={() => showUnavailableMessage('Privacy & security')}
          />
          <View className={"settings-rowDivider"} />
          <SettingsLink
            icon={{ ios: 'person.crop.circle', android: 'manage_accounts', web: 'manage_accounts' }}
            title="Account details"
            description="Update your personal information"
            onPress={() => showUnavailableMessage('Account details')}
          />
        </SettingsSection>

        <SettingsSection title="SUPPORT">
          <SettingsLink
            icon={{ ios: 'questionmark.circle.fill', android: 'help', web: 'help' }}
            title="Help & support"
            description="Find answers and get in touch"
            onPress={() => showUnavailableMessage('Help & support')}
          />
          <View className={"settings-rowDivider"} />
          <View className={"settings-row"}>
            <SettingIcon
              name={{ ios: 'info.circle.fill', android: 'info', web: 'info' }}
            />
            <View className={"settings-rowText"}>
              <Text className={"settings-rowTitle"}>App version</Text>
              <Text className={"settings-rowDescription"}>S-wise · 1.0.0</Text>
            </View>
          </View>
        </SettingsSection>

        <Text className={"settings-footer"}>A little clarity for your everyday.</Text>
          </>
        )}
      </ScrollView>
    </StyledSafeAreaView>
  );
}

function ProfileEditForm({
  profile,
  onBack,
  onSave,
}: {
  profile: { name: string; email: string };
  onBack: () => void;
  onSave: (profile: { name: string; email: string }) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const saveProfile = () => {
    const savedName = name.trim();
    const savedEmail = email.trim();

    if (!savedName || !savedEmail) {
      Alert.alert('Missing details', 'Enter your name and email address to continue.');
      return;
    }

    onSave({ name: savedName, email: savedEmail });
  };

  return (
    <>
      <View className={"settings-editHeader"}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to settings"
          onPress={onBack}
          className={"settings-backButton active:opacity-80 active:scale-[0.98]"}>
          <AppIcon
            name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={colors.dark}
            size={19}
          />
        </Pressable>
        <View className={"settings-editHeading"}>
          <Text className={"settings-eyebrow"}>YOUR ACCOUNT</Text>
          <Text className={"settings-title"}>Edit profile</Text>
        </View>
        <View className={"settings-headerSpacer"} />
      </View>

      <View className={"settings-formIntro"}>
        <View className={"settings-formAvatar"}>
          <AppIcon
            name={{ ios: 'person.fill', android: 'person', web: 'person' }}
            tintColor={colors.dark}
            size={27}
          />
        </View>
        <Text className={"settings-formIntroTitle"}>Your personal details</Text>
        <Text className={"settings-formIntroDescription"}>
          Keep your account information up to date.
        </Text>
      </View>

      <View className={"settings-formCard"}>
        <Text className={"settings-inputLabel"}>FULL NAME</Text>
        <TextInput
          accessibilityLabel="Full name"
          autoCapitalize="words"
          autoComplete="name"
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#A0A9A1"
          returnKeyType="next"
          className={"settings-textInput"}
          value={name}
        />
        <View className={"settings-inputDivider"} />
        <Text className={"settings-inputLabel"}>EMAIL ADDRESS</Text>
        <TextInput
          accessibilityLabel="Email address"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#A0A9A1"
          returnKeyType="done"
          className={"settings-textInput"}
          value={email}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={saveProfile}
        className={"settings-saveButton active:opacity-80 active:scale-[0.98]"}>
        <Text className={"settings-saveButtonText"}>Save changes</Text>
      </Pressable>
    </>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className={"settings-section"}>
      <Text className={"settings-sectionTitle"}>{title}</Text>
      <View className={"settings-sectionCard"}>{children}</View>
    </View>
  );
}

function SettingIcon({ name }: { name: IconName }) {
  return (
    <View className={"settings-iconBox"}>
      <AppIcon name={name} tintColor="#527254" size={17} />
    </View>
  );
}

function SettingsLink({
  icon,
  title,
  description,
  onPress,
}: {
  icon: IconName;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={"settings-row settings-valueRow active:opacity-[0.72]"}>
      <SettingIcon name={icon} />
      <View className={"settings-rowText"}>
        <Text className={"settings-rowTitle"}>{title}</Text>
        <Text className={"settings-rowDescription"}>{description}</Text>
      </View>
      <AppIcon
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        tintColor="#A0A9A1"
        size={16}
      />
    </Pressable>
  );
}
