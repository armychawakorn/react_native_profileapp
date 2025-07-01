import { Text, View, StyleSheet, Image, ScrollView, SafeAreaView } from "react-native";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('../assets/profile.jpg')} 
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>ชวกร เนืองภา</Text>
          <Text style={styles.title}>นักศึกษาวิทยาการคอมพิวเตอร์ ปี 4</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ข้อมูลส่วนตัว</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ชื่อ-นามสกุล:</Text>
            <Text style={styles.value}>ชวกร เนืองภา</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>สาขา:</Text>
            <Text style={styles.value}>วิทยาการคอมพิวเตอร์และสารสนเทศ</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>หลักสูตร:</Text>
            <Text style={styles.value}>วิทยาศาสตรบัณฑิต ปี 4</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>มหาวิทยาลัย:</Text>
            <Text style={styles.value}>มหาวิทยาลัยขอนแก่น</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ที่อยู่:</Text>
            <Text style={styles.value}>อุดรธานี, ประเทศไทย</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>สถานะ:</Text>
            <Text style={styles.value}>เปิดรับงาน</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ความสามารถและทักษะ</Text>
          
          <View style={styles.skillsContainer}>
            <View style={styles.skillItem}>
              <Text style={styles.skillTitle}>💻 Programming Languages</Text>
              <Text style={styles.skillDesc}>C#, Java, JavaScript, TypeScript, Python</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={styles.skillTitle}>🎨 Frontend Development</Text>
              <Text style={styles.skillDesc}>React, Next.js, HTML5, CSS3</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={styles.skillTitle}>⚙️ Backend Development</Text>
              <Text style={styles.skillDesc}>Node.js, Express.js, .NET Framework</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={styles.skillTitle}>�️ Databases</Text>
              <Text style={styles.skillDesc}>MySQL, PostgreSQL, MongoDB, SQLite</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={styles.skillTitle}>🔧 Tools & Platforms</Text>
              <Text style={styles.skillDesc}>VS Code, Visual Studio, Git, GitHub, Docker, AWS</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={styles.skillTitle}>📱 Mobile Development</Text>
              <Text style={styles.skillDesc}>React Native, Cross-platform Apps</Text>
            </View>
            
            <View style={styles.skillItem}>
              <Text style={styles.skillTitle}>� Professional Experience</Text>
              <Text style={styles.skillDesc}>Backend Developer Intern at BotNoi Group</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>เกี่ยวกับฉัน</Text>
          <Text style={styles.aboutText}>
            นักศึกษาวิทยาการคอมพิวเตอร์และสารสนเทศ ปี 4 มหาวิทยาลัยขอนแก่น ที่มีประสบการณ์ทำงานเป็น Backend Developer Intern 
            ที่บริษัท BotNoi Group ซึ่งเป็นแพลตฟอร์ม AI Chatbot ชั้นนำในประเทศไทย มีความเชี่ยวชาญในการพัฒนา API, ระบบ Backend 
            และการออกแบบฐานข้อมูล มีความสนใจในเทคโนโลยี AI และการพัฒนาซอฟต์แวร์ พร้อมที่จะเริ่มงานเป็น Full-time Developer
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ประสบการณ์การทำงาน</Text>
          
          <View style={styles.experienceItem}>
            <Text style={styles.experienceTitle}>🤖 Backend Developer Intern</Text>
            <Text style={styles.experienceCompany}>BotNoi Group</Text>
            <Text style={styles.experienceDesc}>
              • พัฒนา Backend สำหรับ Botnoi AI Friend's hub{'\n'}
              • ออกแบบและปรับปรุงสถาปัตยกรรมฐานข้อมูล{'\n'}
              • พัฒนา RESTful APIs สำหรับการโต้ตอบกับ AI{'\n'}
              • สร้างเอกสารทางเทคนิคสำหรับระบบ
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ติดต่อ</Text>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📧</Text>
            <Text style={styles.contactText}>Chawakorn.n@kkumail.com</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>084-297-9685</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>🌐</Text>
            <Text style={styles.contactText}>github.com/armychawakorn</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>💼</Text>
            <Text style={styles.contactText}>linkedin.com/in/chawakorn-nuangpha</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={styles.contactText}>LINE: solid_soul</Text>
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