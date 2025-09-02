import { Text, View, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { showAuthAlerts } from '../utils/alertUtils';

const Home = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    showAuthAlerts.logoutConfirm(() => {
      logout();
      router.replace('/signin');
    });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.headerBackground,
      paddingTop: 40,
      paddingBottom: 30,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
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
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 15,
      textAlign: 'center',
    },
    name: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.headerText,
      marginTop: 15,
      textAlign: 'center',
    },
    title: {
      fontSize: 16,
      color: theme.textLight,
      marginTop: 5,
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: '500',
      flex: 1,
    },
    value: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '600',
      flex: 2,
      textAlign: 'right',
    },
    skillTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    skillDesc: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    aboutText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.text,
      textAlign: 'justify',
    },
    contactText: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
    },
    experienceTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    experienceDesc: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    navButton: {
      backgroundColor: theme.secondary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginHorizontal: 5,
      marginVertical: 5,
      alignItems: 'center',
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    navButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    navContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingVertical: 10,
    },
  });

  // แสดงชื่อผู้ใช้จาก API หรือใช้ชื่อเดิมถ้าไม่มีข้อมูล
  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'ชวกร เนืองภา';
  const displayEmail = user ? user.email : 'Chawakorn.n@kkumail.com';

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={dynamicStyles.header}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('../assets/profile.jpg')} 
              style={styles.profileImage}
            />
          </View>
          <Text style={dynamicStyles.name}>{displayName}</Text>
          <Text style={dynamicStyles.title}>
            {user ? 'ผู้ใช้ระบบ' : 'นักศึกษาวิทยาการคอมพิวเตอร์ ปี 4'}
          </Text>
          {user && (
            <Text style={dynamicStyles.title}>เข้าสู่ระบบแล้ว</Text>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>🔗 เมนูหลัก</Text>
          <View style={dynamicStyles.navContainer}>
            <TouchableOpacity 
              style={dynamicStyles.navButton}
              onPress={() => router.push('/about')}
            >
              <Text style={dynamicStyles.navButtonText}>📚 รายวิชา</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={dynamicStyles.navButton}
              onPress={() => router.push('/book')}
            >
              <Text style={dynamicStyles.navButtonText}>📖 หนังสือ</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={dynamicStyles.navButton}
              onPress={() => router.push('/settings')}
            >
              <Text style={dynamicStyles.navButtonText}>⚙️ Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[dynamicStyles.navButton, { backgroundColor: theme.accent }]}
              onPress={handleLogout}
            >
              <Text style={dynamicStyles.navButtonText}>🚪 ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>ข้อมูลส่วนตัว</Text>
          
          <View style={dynamicStyles.infoRow}>
            <Text style={dynamicStyles.label}>ชื่อ-นามสกุล:</Text>
            <Text style={dynamicStyles.value}>{displayName}</Text>
          </View>
          
          <View style={dynamicStyles.infoRow}>
            <Text style={dynamicStyles.label}>อีเมล:</Text>
            <Text style={dynamicStyles.value}>{displayEmail}</Text>
          </View>
          
          {user && (
            <View style={dynamicStyles.infoRow}>
              <Text style={dynamicStyles.label}>ชื่อผู้ใช้:</Text>
              <Text style={dynamicStyles.value}>{user.username}</Text>
            </View>
          )}
          
          <View style={dynamicStyles.infoRow}>
            <Text style={dynamicStyles.label}>สาขา:</Text>
            <Text style={dynamicStyles.value}>วิทยาการคอมพิวเตอร์และสารสนเทศ</Text>
          </View>
          
          <View style={dynamicStyles.infoRow}>
            <Text style={dynamicStyles.label}>หลักสูตร:</Text>
            <Text style={dynamicStyles.value}>วิทยาศาสตรบัณฑิต ปี 4</Text>
          </View>
          
          <View style={dynamicStyles.infoRow}>
            <Text style={dynamicStyles.label}>มหาวิทยาลัย:</Text>
            <Text style={dynamicStyles.value}>มหาวิทยาลัยขอนแก่น</Text>
          </View>
          
          <View style={dynamicStyles.infoRow}>
            <Text style={dynamicStyles.label}>ที่อยู่:</Text>
            <Text style={dynamicStyles.value}>อุดรธานี, ประเทศไทย</Text>
          </View>
          
          <View style={dynamicStyles.infoRow}>
            <Text style={dynamicStyles.label}>สถานะ:</Text>
            <Text style={dynamicStyles.value}>{user ? 'ออนไลน์' : 'เปิดรับงาน'}</Text>
          </View>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>ความสามารถและทักษะ</Text>
          
          <View style={styles.skillsContainer}>
            <View style={styles.skillItem}>
              <Text style={dynamicStyles.skillTitle}>💻 Programming Languages</Text>
              <Text style={dynamicStyles.skillDesc}>C#, Java, JavaScript, TypeScript, Python</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={dynamicStyles.skillTitle}>🎨 Frontend Development</Text>
              <Text style={dynamicStyles.skillDesc}>React, Next.js, HTML5, CSS3</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={dynamicStyles.skillTitle}>⚙️ Backend Development</Text>
              <Text style={dynamicStyles.skillDesc}>Node.js, Express.js, .NET Framework</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={dynamicStyles.skillTitle}>🗄️ Databases</Text>
              <Text style={dynamicStyles.skillDesc}>MySQL, PostgreSQL, MongoDB, SQLite</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={dynamicStyles.skillTitle}>🔧 Tools & Platforms</Text>
              <Text style={dynamicStyles.skillDesc}>VS Code, Visual Studio, Git, GitHub, Docker, AWS</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={dynamicStyles.skillTitle}>📱 Mobile Development</Text>
              <Text style={dynamicStyles.skillDesc}>React Native, Cross-platform Apps</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={dynamicStyles.skillTitle}>💼 Professional Experience</Text>
              <Text style={dynamicStyles.skillDesc}>Backend Developer Intern at BotNoi Group</Text>
            </View>
          </View>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>เกี่ยวกับฉัน</Text>
          <Text style={dynamicStyles.aboutText}>
            นักศึกษาวิทยาการคอมพิวเตอร์และสารสนเทศ ปี 4 มหาวิทยาลัยขอนแก่น ที่มีประสบการณ์ทำงานเป็น Backend Developer Intern 
            ที่บริษัท BotNoi Group ซึ่งเป็นแพลตฟอร์ม AI Chatbot ชั้นนำในประเทศไทย มีความเชี่ยวชาญในการพัฒนา API, ระบบ Backend 
            และการออกแบบฐานข้อมูล มีความสนใจในเทคโนโลยี AI และการพัฒนาซอฟต์แวร์ พร้อมที่จะเริ่มงานเป็น Full-time Developer
          </Text>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>ประสบการณ์การทำงาน</Text>
          
          <View style={styles.experienceItem}>
            <Text style={dynamicStyles.experienceTitle}>🤖 Backend Developer Intern</Text>
            <Text style={styles.experienceCompany}>BotNoi Group</Text>
            <Text style={dynamicStyles.experienceDesc}>
              • พัฒนา Backend สำหรับ Botnoi AI Friend's hub{'\n'}
              • ออกแบบและปรับปรุงสถาปัตยกรรมฐานข้อมูล{'\n'}
              • พัฒนา RESTful APIs สำหรับการโต้ตอบกับ AI{'\n'}
              • สร้างเอกสารทางเทคนิคสำหรับระบบ
            </Text>
          </View>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>ติดต่อ</Text>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📧</Text>
            <Text style={dynamicStyles.contactText}>{displayEmail}</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={dynamicStyles.contactText}>084-297-9685</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>🌐</Text>
            <Text style={dynamicStyles.contactText}>github.com/armychawakorn</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>💼</Text>
            <Text style={dynamicStyles.contactText}>linkedin.com/in/chawakorn-nuangpha</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={dynamicStyles.contactText}>LINE: solid_soul</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profileImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#bdc3c7',
    marginTop: 5,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  label: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  skillsContainer: {
    gap: 12,
  },
  skillItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  skillDesc: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    textAlign: 'justify',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
  },
  contactText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  experienceItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
  },
  experienceDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});

export default Home;
