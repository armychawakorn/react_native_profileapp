import { View, Text, StyleSheet } from "react-native";

const Signup = () => {
  return <View style={style.container}></View>;
};
export default Signup;

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
