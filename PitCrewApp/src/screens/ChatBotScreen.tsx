import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Modal } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ChatBotScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: '1', name: 'General' },
    { id: '2', name: 'Maintenance' },
    { id: '3', name: 'Engine Issues' },
    { id: '4', name: 'Fuel Efficiency' },
    { id: '5', name: 'Other' },
  ];

  const faqs: { [key: string]: { question: string; answer: string; }[] } = {
    'General': [
      { question: 'What should I do if my car won’t start?', answer: 'If your car won’t start, check the battery, fuel level, and ignition system.' },
      { question: 'Why is my car making a strange noise?', answer: 'Strange noises can be due to various issues such as a loose belt, low fluid levels, or worn out parts.' },
      { question: 'How do I jump-start my car?', answer: 'To jump-start your car, connect the positive and negative cables to the appropriate terminals on both batteries.' },
      { question: 'What should I do if my car overheats?', answer: 'If your car overheats, turn off the engine, wait for it to cool down, and check the coolant levels.' },
      { question: 'Why is my car vibrating?', answer: 'Car vibrations can be caused by unbalanced tires, engine issues, or worn-out suspension components.' },
      { question: 'How can I tell if my brakes need replacing?', answer: 'If your brakes squeak, grind, or the pedal feels soft, it may be time to replace them.' },
      { question: 'What should I do if my car is leaking fluid?', answer: 'Identify the color and location of the leak to determine the type of fluid and address the issue accordingly.' },
      { question: 'Why is my steering wheel shaking?', answer: 'A shaking steering wheel can be caused by unbalanced tires, misalignment, or worn-out suspension parts.' },
      { question: 'How often should I check my tire pressure?', answer: 'Check your tire pressure at least once a month and before long trips.' },
      { question: 'Why is my car’s fuel efficiency decreasing?', answer: 'Decreased fuel efficiency can result from underinflated tires, dirty air filters, or engine issues.' },
    ],
    'Maintenance': [
      { question: 'How often should I change my oil?', answer: 'It is generally recommended to change your oil every 3,000 to 5,000 miles.' },
      { question: 'What should I do to prepare my car for winter?', answer: 'To prepare your car for winter, check the antifreeze, battery, tires, and windshield wipers.' },
      { question: 'How often should I replace my air filter?', answer: 'Replace your air filter every 12,000 to 15,000 miles or as recommended by your manufacturer.' },
      { question: 'What maintenance should I perform on my car regularly?', answer: 'Regular maintenance includes oil changes, tire rotations, brake inspections, and fluid checks.' },
      { question: 'How do I check my tire tread depth?', answer: 'Use a tread depth gauge or the penny test to ensure your tire tread is above 2/32 of an inch.' },
      { question: 'When should I replace my windshield wipers?', answer: 'Replace your windshield wipers every 6 to 12 months or when they show signs of wear.' },
      { question: 'How often should I flush my radiator?', answer: 'Flush your radiator every 30,000 to 50,000 miles or as recommended by your manufacturer.' },
      { question: 'What should I do if my battery dies?', answer: 'If your battery dies, jump-start your car or replace the battery if it’s old or damaged.' },
      { question: 'How often should I replace my spark plugs?', answer: 'Replace your spark plugs every 30,000 to 100,000 miles, depending on your vehicle and spark plug type.' },
      { question: 'What maintenance should I perform on my car’s transmission?', answer: 'Regularly check and replace transmission fluid and filter as recommended by your manufacturer.' },
    ],
    'Engine Issues': [
      { question: 'What does the check engine light mean?', answer: 'The check engine light can indicate a variety of issues, ranging from minor to severe. It’s best to have it checked by a professional.' },
      { question: 'Why is my engine overheating?', answer: 'Engine overheating can be caused by low coolant levels, a faulty thermostat, or a malfunctioning water pump.' },
      { question: 'What causes engine knocking?', answer: 'Engine knocking can be caused by low octane fuel, carbon buildup, or engine wear.' },
      { question: 'Why is my engine misfiring?', answer: 'Engine misfires can be caused by faulty spark plugs, ignition coils, or fuel injectors.' },
      { question: 'What should I do if my engine oil is low?', answer: 'If your engine oil is low, add the recommended oil type and check for leaks or excessive oil consumption.' },
      { question: 'Why is my car losing power?', answer: 'Loss of power can be due to clogged fuel filters, faulty sensors, or engine issues.' },
      { question: 'What causes black smoke from the exhaust?', answer: 'Black smoke can indicate a rich fuel mixture, burning oil, or a clogged air filter.' },
      { question: 'Why is my car’s idle rough?', answer: 'A rough idle can be caused by dirty fuel injectors, a faulty idle air control valve, or vacuum leaks.' },
      { question: 'What does white smoke from the exhaust mean?', answer: 'White smoke can indicate coolant entering the combustion chamber due to a blown head gasket or cracked engine block.' },
      { question: 'How do I fix an engine oil leak?', answer: 'Fixing an oil leak involves identifying the source, such as a gasket or seal, and replacing the faulty part.' },
    ],
    'Fuel Efficiency': [
      { question: 'How can I improve my fuel efficiency?', answer: 'To improve fuel efficiency, maintain your car regularly, drive smoothly, and avoid excessive idling.' },
      { question: 'What type of fuel is best for my car?', answer: 'Refer to your owner’s manual to determine the best type of fuel for your car.' },
      { question: 'Does driving slower save fuel?', answer: 'Driving at a steady, moderate speed can help save fuel compared to rapid acceleration and deceleration.' },
      { question: 'How does tire pressure affect fuel efficiency?', answer: 'Proper tire pressure reduces rolling resistance, improving fuel efficiency.' },
      { question: 'Do roof racks affect fuel efficiency?', answer: 'Roof racks can increase aerodynamic drag, reducing fuel efficiency.' },
      { question: 'How does air conditioning affect fuel efficiency?', answer: 'Using air conditioning can reduce fuel efficiency, especially at low speeds or while idling.' },
      { question: 'Does engine size affect fuel efficiency?', answer: 'Larger engines typically consume more fuel, but efficiency also depends on driving habits and maintenance.' },
      { question: 'How do I choose the right motor oil for fuel efficiency?', answer: 'Use the manufacturer-recommended oil viscosity and consider synthetic oils for better efficiency.' },
      { question: 'Can using cruise control save fuel?', answer: 'Using cruise control on highways can help maintain a steady speed, improving fuel efficiency.' },
      { question: 'Does carrying extra weight affect fuel efficiency?', answer: 'Extra weight increases fuel consumption, so remove unnecessary items from your vehicle.' },
    ],
    'Other': [
      { question: 'How do I find a good mechanic?', answer: 'Look for a mechanic with good reviews, proper certifications, and reasonable pricing.' },
      { question: 'What should I do if I get a flat tire?', answer: 'If you get a flat tire, find a safe place to pull over, use your spare tire kit, or call for roadside assistance.' },
      { question: 'How do I check my car’s fluid levels?', answer: 'Check fluid levels regularly, including oil, coolant, brake fluid, and transmission fluid, using dipsticks or reservoirs.' },
      { question: 'What should I keep in my car for emergencies?', answer: 'Keep a spare tire, jack, jumper cables, flashlight, first-aid kit, and emergency contact information in your car.' },
      { question: 'How do I jump-start another car?', answer: 'To jump-start another car, connect the positive and negative cables to the appropriate terminals on both batteries.' },
      { question: 'What should I do if I lock myself out of my car?', answer: 'If locked out, call a locksmith, roadside assistance, or use a spare key if available.' },
      { question: 'How can I prevent car theft?', answer: 'To prevent car theft, lock your doors, use an alarm system, park in well-lit areas, and avoid leaving valuables in sight.' },
      { question: 'What are the signs of a failing alternator?', answer: 'Signs of a failing alternator include dimming lights, battery warning light, and electrical issues.' },
      { question: 'How do I maintain my car’s paint job?', answer: 'Maintain your car’s paint by washing regularly, applying wax, and parking in the shade.' },
      { question: 'How often should I rotate my tires?', answer: 'Rotate your tires every 6,000 to 8,000 miles or as recommended by your manufacturer to ensure even wear.' },
    ],
  };
  

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today? select your quection from the list',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Assistant',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const handleSend = (newMessages: IMessage | IMessage[] = []) => {
    const messagesArray = Array.isArray(newMessages) ? newMessages : [newMessages];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messagesArray)
    );
  };

  const handleQuestionSelect = (question: string, answer: string) => {
    setModalVisible(false);
    handleSend({
      _id: Math.round(Math.random() * 1000000),
      text: question,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    });
    handleSend({
      _id: Math.round(Math.random() * 1000000),
      text: answer,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'AI Assistant',
        avatar: 'https://placeimg.com/140/140/any',
      },
    });
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PitCrew Chat Assistent</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.questionButton}>
          <Icon name="help-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => handleSend(messages)}
        user={{
          _id: 1,
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          {selectedCategory ? (
            <FlatList
              data={faqs[selectedCategory]}
              keyExtractor={(item) => item.question}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.questionItem} onPress={() => handleQuestionSelect(item.question, item.answer)}>
                  <Text style={styles.questionText}>{item.question}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategorySelect(item.name)}>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#291D7D',
    height: 60,
    paddingHorizontal: 15,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionButton: {
    position: 'absolute',
    right: 15,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryText: {
    fontSize: 18,
  },
  questionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  questionText: {
    fontSize: 18,
  },
});

export default ChatBotScreen;
