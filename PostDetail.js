import Moment from "moment";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
} from "react-native";

export default function PostDetail({ navigation, route }) {
  debugger;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {Object.keys(route.params.postData).map((key) => {
          return (
            <Text style={styles.cardValue} key={key}>{`${key} : ${
              typeof route.params.postData[key] === "object"
                ? JSON.stringify(route.params.postData[key])
                : route.params.postData[key]
            }`}</Text>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  cardTitle: { fontSize: 14, fontWeight: "bold" },
  cardValue: { fontSize: 14, paddingBottom: 8 },
});
