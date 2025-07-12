import React from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();

  const subjects = [
    {
      code: "CS101",
      name: "Introduction to Computer Science",
      credits: 3,
      description: "พื้นฐานวิทยาการคอมพิวเตอร์ อัลกอริทึม และการเขียนโปรแกรม"
    },
    {
      code: "CS201",
      name: "Data Structures and Algorithms",
      credits: 3,
      description: "โครงสร้างข้อมูลและอัลกอริทึมขั้นสูง"
    },
    {
      code: "CS301",
      name: "Database Systems",
      credits: 3,
      description: "ระบบฐานข้อมูล SQL และ NoSQL"
    },
    {
      code: "CS401",
      name: "Software Engineering",
      credits: 3,
      description: "วิศวกรรมซอฟต์แวร์และการจัดการโปรเจค"
    },
    {
      code: "CS402",
      name: "Web Development",
      credits: 3,
      description: "การพัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js"
    },
    {
      code: "CS403",
      name: "Mobile App Development",
      credits: 3,
      description: "การพัฒนาแอปพลิเคชันมือถือด้วย React Native"
    }
  ];

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    card: {
      backgroundColor: theme.cardBackground,
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 15,
      padding: 20,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 15,
      marginTop: 10,
    },
    subjectCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      borderLeftWidth: 4,
      borderLeftColor: theme.secondary,
    },
    subjectCode: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 5,
    },
    subjectName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 5,
    },
    subjectCredits: {
      fontSize: 14,
      color: theme.secondary,
      marginBottom: 8,
    },
    subjectDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    summaryCard: {
      backgroundColor: theme.primary,
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
    },
    summaryText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    summaryNumber: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 5,
    },
  });

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.title}>� รายวิชาที่เรียน</Text>
          
          <View style={dynamicStyles.summaryCard}>
            <Text style={dynamicStyles.summaryText}>จำนวนวิชาทั้งหมด</Text>
            <Text style={dynamicStyles.summaryNumber}>{subjects.length}</Text>
            <Text style={dynamicStyles.summaryText}>รวม {totalCredits} หน่วยกิต</Text>
          </View>

          <Text style={dynamicStyles.sectionTitle}>📖 รายละเอียดวิชา</Text>
          
          {subjects.map((subject, index) => (
            <View key={index} style={dynamicStyles.subjectCard}>
              <Text style={dynamicStyles.subjectCode}>{subject.code}</Text>
              <Text style={dynamicStyles.subjectName}>{subject.name}</Text>
              <Text style={dynamicStyles.subjectCredits}>
                📊 {subject.credits} หน่วยกิต
              </Text>
              <Text style={dynamicStyles.subjectDescription}>
                {subject.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.sectionTitle}>🎓 สาขาวิชา</Text>
          <View style={dynamicStyles.subjectCard}>
            <Text style={dynamicStyles.subjectName}>
              วิทยาการคอมพิวเตอร์และสารสนเทศ
            </Text>
            <Text style={dynamicStyles.subjectDescription}>
              คณะวิทยาศาสตร์ มหาวิทยาลัยขอนแก่น
            </Text>
            <Text style={dynamicStyles.subjectDescription}>
              หลักสูตรวิทยาศาสตรบัณฑิต (วท.บ.) ปี 4
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default About;
