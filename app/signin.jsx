import { View, Text, StyleSheet, TextInput, Button } from "react-native";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };
  handleSingin = () => {};
  return (
    <View style={style.container}>
      <TextInput
        value={email}
        onChange={handleChange}
        placeholder="email@email.com"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChange={handleChange}
        secureTextEntry={true} // hides the password input
        placeholder="Password"
      />
      <Button title="Signin" onPress={handleSingin} />
    </View>
  );
};
export default Signin;

const style = StyleSheet.create({
  container: {
    marginVertical: 14,
    marginHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
  },
  text: {},
  profile: {
    height: 128,
    width: 128,
    borderRadius: 50,
  },
});
