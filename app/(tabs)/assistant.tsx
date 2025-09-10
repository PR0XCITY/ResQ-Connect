import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Bot, Send, Shield, MapPin, Phone, TriangleAlert as AlertTriangle, Lightbulb, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Markdown from 'react-native-markdown-display';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIAssistantScreen() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Saheli AI safety assistant. I'm here to help you with safety advice, emergency guidance, and answer any questions about staying safe. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickSuggestions = [
    {
      id: 1,
      text: "What should I do if I feel unsafe walking alone?",
      icon: Shield,
    },
    {
      id: 2,
      text: "How to find the safest route to my destination?",
      icon: MapPin,
    },
    {
      id: 3,
      text: "Emergency contact best practices",
      icon: Phone,
    },
    {
      id: 4,
      text: "What to do in a harassment situation?",
      icon: AlertTriangle,
    },
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('unsafe') || lowerMessage.includes('walking alone')) {
      return `**Safety Tips for Walking Alone:**

🚶‍♀️ **Stay Alert & Aware**
- Keep your head up and avoid distractions like phones or headphones
- Trust your instincts - if something feels wrong, it probably is

🌟 **Choose Safe Routes**
- Use well-lit, populated areas whenever possible
- Avoid shortcuts through isolated areas
- Use the Safe Routes feature in Saheli to find community-verified paths

📱 **Stay Connected**
- Share your location with trusted contacts
- Keep your phone charged and easily accessible
- Consider using the Saheli emergency alert if you feel threatened

👥 **Blend In & Be Confident**
- Walk with purpose and confidence
- Avoid displaying expensive items or large amounts of cash
- If possible, walk with others or in groups

Would you like specific advice for any particular situation?`;
    }
    
    if (lowerMessage.includes('route') || lowerMessage.includes('destination')) {
      return `**Finding Safe Routes with Saheli:**

🗺️ **Use Safe Routes Tab**
- Check community-verified safe paths
- Look for routes with high safety ratings (4+ stars)
- Pay attention to recent community reports

⏰ **Time Considerations**
- Avoid traveling alone late at night when possible
- Choose routes with good lighting and visibility
- Consider peak hours when more people are around

📍 **Route Planning Tips**
- Plan your route in advance, don't rely on last-minute decisions
- Have backup routes in case your primary path feels unsafe
- Share your planned route with trusted contacts

🚨 **Red Flags to Avoid**
- Areas with recent suspicious activity reports
- Poorly lit or isolated paths
- Construction zones or blocked walkways

The Saheli app continuously updates route safety based on real community feedback!`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('contact')) {
      return `**Emergency Contact Best Practices:**

👥 **Choose the Right Contacts**
- Select 3-5 trusted people who are likely to respond quickly
- Include family members, close friends, and local contacts
- Ensure they understand their role as emergency contacts

📱 **Contact Information**
- Keep contact details updated regularly
- Include both phone numbers and alternative contact methods
- Consider adding local emergency services numbers

⚡ **Quick Access Setup**
- Use Saheli's one-tap emergency alert feature
- Set up emergency contacts in your phone's emergency settings
- Practice using emergency features so you're familiar with them

🔄 **Regular Updates**
- Review and update your emergency contacts monthly
- Inform your contacts about their role and what to expect
- Test the system occasionally to ensure it works

📍 **Location Sharing**
- Enable location sharing with emergency contacts
- Ensure they know how to access your shared location
- Consider using family tracking apps as backup

Remember: In a real emergency, always call local emergency services (911, 100, etc.) first!`;
    }
    
    if (lowerMessage.includes('harassment') || lowerMessage.includes('uncomfortable')) {
      return `**Dealing with Harassment Situations:**

🛡️ **Immediate Safety**
- Trust your instincts - if you feel uncomfortable, take action
- Move to a public, well-lit area with other people around
- Use Saheli's emergency alert if you feel threatened

🗣️ **Verbal Response**
- Be firm and clear: "Stop" or "Leave me alone"
- Don't engage in lengthy conversations or arguments
- Speak loudly to draw attention if necessary

📱 **Document & Report**
- If safe to do so, document the incident (photos, videos, notes)
- Report to local authorities if appropriate
- Share the incident in Saheli's Community Alerts to warn others

👥 **Seek Help**
- Ask nearby people for help if needed
- Go into a store, restaurant, or public building
- Call a trusted friend or family member

🏃‍♀️ **Exit Strategy**
- Always have an exit plan when in unfamiliar situations
- Keep transportation options available (taxi apps, public transit)
- Don't hesitate to leave a situation that makes you uncomfortable

💪 **Follow-up**
- Talk to someone you trust about the experience
- Consider reporting to relevant authorities
- Take care of your mental health - harassment can be traumatic

You're not alone, and it's never your fault. Stay strong! 💜`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('advice')) {
      return `I'm here to help with any safety-related questions! I can provide guidance on:

🛡️ **Personal Safety**
- Walking alone safely
- Situational awareness tips
- Self-defense basics

🗺️ **Navigation & Routes**
- Finding safe paths
- Route planning strategies
- Area safety assessment

🚨 **Emergency Preparedness**
- Emergency contact setup
- Crisis response planning
- Using Saheli's safety features

👥 **Social Safety**
- Dealing with harassment
- Trusting your instincts
- Building support networks

What specific topic would you like to discuss?`;
    }
    
    return `Thank you for your question! While I can provide general safety advice, for specific situations I recommend:

🔍 **For immediate safety concerns**: Use Saheli's emergency alert feature or contact local emergency services

📱 **For location-specific advice**: Check the Community Alerts tab for real-time local safety information

🗺️ **For route planning**: Use the Safe Routes feature to find community-verified safe paths

💬 **For detailed guidance**: Feel free to ask more specific questions about personal safety, emergency preparedness, or using Saheli's features.

Is there a particular safety topic you'd like to explore further?`;
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText.trim()),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);

    // Scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const MessageBubble = ({ message, index }: { message: Message; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={[
        styles.messageBubble,
        message.isUser ? 
          [styles.userMessage, { backgroundColor: theme.colors.primary }] : 
          [styles.aiMessage, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]
      ]}
    >
      {!message.isUser && (
        <View style={[styles.aiIcon, { backgroundColor: theme.colors.surface }]}>
          <Bot size={16} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.messageContent}>
        {message.isUser ? (
          <Text style={[styles.messageText, { color: '#FFFFFF' }]}>
            {message.text}
          </Text>
        ) : (
          <Markdown
            style={{
              body: { color: theme.colors.text, fontSize: 14, lineHeight: 20 },
              strong: { color: theme.colors.text, fontWeight: 'bold' },
              em: { color: theme.colors.textSecondary, fontStyle: 'italic' },
              heading1: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
              heading2: { color: theme.colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
              list_item: { color: theme.colors.text, marginBottom: 4 },
              code_inline: { backgroundColor: theme.colors.surface, color: theme.colors.primary, paddingHorizontal: 4, borderRadius: 4 },
            }}
          >
            {message.text}
          </Markdown>
        )}
        <Text style={[
          styles.timestamp, 
          { color: message.isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary }
        ]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Animated.View>
  );

  const SuggestionCard = ({ suggestion, index }: { suggestion: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
      <TouchableOpacity
        style={[styles.suggestionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => handleSuggestionPress(suggestion.text)}
      >
        <View style={[styles.suggestionIcon, { backgroundColor: theme.colors.surface }]}>
          <suggestion.icon size={16} color={theme.colors.primary} />
        </View>
        <Text style={[styles.suggestionText, { color: theme.colors.text }]} numberOfLines={2}>
          {suggestion.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradient: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 12,
      margin: 20,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      marginRight: 12,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      padding: 8,
    },
    suggestionsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    suggestionsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    typingText: {
      color: theme.colors.textSecondary,
      marginLeft: 12,
      fontStyle: 'italic',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <LinearGradient
        colors={theme.colors.gradient}
        style={dynamicStyles.gradient}
      >
        <Animated.View
          entering={FadeInLeft.duration(600)}
          style={dynamicStyles.header}
        >
          <Text style={dynamicStyles.title}>AI Safety Assistant</Text>
          <Text style={dynamicStyles.subtitle}>
            Get personalized safety advice and guidance
          </Text>
        </Animated.View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            ref={scrollViewRef}
            style={dynamicStyles.chatContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
            
            {isTyping && (
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={dynamicStyles.typingIndicator}
              >
                <Bot size={16} color={theme.colors.primary} />
                <Text style={dynamicStyles.typingText}>AI is thinking...</Text>
              </Animated.View>
            )}
          </ScrollView>

          {messages.length === 1 && (
            <View style={dynamicStyles.suggestionsContainer}>
              <Text style={dynamicStyles.suggestionsTitle}>Quick Questions</Text>
              {quickSuggestions.map((suggestion, index) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} index={index} />
              ))}
            </View>
          )}

          <View style={dynamicStyles.inputContainer}>
            <TextInput
              style={dynamicStyles.textInput}
              placeholder="Ask me about safety..."
              placeholderTextColor={theme.colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={dynamicStyles.sendButton}
              onPress={sendMessage}
              disabled={inputText.trim() === '' || isTyping}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageContent: {
    flex: 1,
    padding: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
});