import { router } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledSafeAreaView = styled(SafeAreaView);

type AuthMode = 'sign-in' | 'sign-up';

export default function AuthScreen({ mode }: { mode: AuthMode }) {
  const [activeMode, setActiveMode] = useState(mode);
  const isSignUp = activeMode === 'sign-up';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const changeMode = (nextMode: AuthMode) => {
    setActiveMode(nextMode);
  };

  return (
    <StyledSafeAreaView className="auth-safeArea" edges={['top', 'bottom']}>
      <ScrollView
        className="auth-scrollView"
        contentContainerClassName="auth-content"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="auth-brand">
          <View className="auth-brandMark">
            <Text className="auth-brandMarkText">s</Text>
            <View className="auth-brandMarkDot" />
          </View>
          <Text className="auth-brandName">s-wise</Text>
        </View>

        <View className="auth-intro">
          <Text className="auth-eyebrow">YOUR MONEY, IN SYNC</Text>
          <Text className="auth-title">
            {isSignUp ? 'Make room for\na clearer picture.' : 'Welcome\nback.'}
          </Text>
          <Text className="auth-description">
            {isSignUp
              ? 'Build better money habits, one small step at a time.'
              : 'Your everyday finances are right where you left them.'}
          </Text>
        </View>

        <View className="auth-modeSwitch">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: !isSignUp }}
            onPress={() => changeMode('sign-in')}
            className={[
              'auth-modeOption',
              !isSignUp ? 'auth-modeOptionActive' : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            <Text
              className={[
                'auth-modeText',
                !isSignUp ? 'auth-modeTextActive' : '',
              ]
                .filter(Boolean)
                .join(' ')}>
              Sign in
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSignUp }}
            onPress={() => changeMode('sign-up')}
            className={[
              'auth-modeOption',
              isSignUp ? 'auth-modeOptionActive' : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            <Text
              className={[
                'auth-modeText',
                isSignUp ? 'auth-modeTextActive' : '',
              ]
                .filter(Boolean)
                .join(' ')}>
              Create account
            </Text>
          </Pressable>
        </View>

        <View className="auth-form">
          {isSignUp && (
            <AuthField
              label="FULL NAME"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              textContentType="name"
            />
          )}
          <AuthField
            label="EMAIL ADDRESS"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <AuthField
            label="PASSWORD"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType={isSignUp ? 'newPassword' : 'password'}
          />
          {!isSignUp && (
            <View className="auth-forgotButton">
              <Text className="auth-forgotText">Forgot password?</Text>
            </View>
          )}
        </View>

        {isSignUp ? (
          <View className="auth-submitButton">
            <Text className="auth-submitText">Create account</Text>
            <Text className="auth-submitArrow">→</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/(tabs)')}
            className="auth-submitButton">
            <Text className="auth-submitText">Sign in</Text>
            <Text className="auth-submitArrow">→</Text>
          </Pressable>
        )}

        <Text className="auth-footer">
          {isSignUp
            ? 'By creating an account, you agree to our Terms and Privacy Policy.'
            : 'Your financial life, a little more in focus.'}
        </Text>
      </ScrollView>
    </StyledSafeAreaView>
  );
}

type AuthFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  textContentType?: 'name' | 'emailAddress' | 'newPassword' | 'password';
};

function AuthField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  textContentType,
}: AuthFieldProps) {
  return (
    <View className="auth-field">
      <Text className="auth-fieldLabel">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        className="auth-textInput"
        placeholder={placeholder}
        placeholderTextColor="#A0A9A1"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
        returnKeyType="next"
      />
    </View>
  );
}
