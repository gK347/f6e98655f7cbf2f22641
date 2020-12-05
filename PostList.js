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

export default function PostList({ navigation }) {
  const [postData, setPostData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  let isAPICall = false;

  useEffect(() => {
    callThePostApi(0);
    // let interval = setInterval(() => callThePostApi(pageNumber), 3000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  const callThePostApi = (pageNum) => {
    console.log("paheNum:", pageNum);
    if (!isAPICall) {
      isAPICall = true;
      const url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`;
      fetch(url)
        .then((response) => response.json())
        .then((res) => {
          console.log("RES:", pageNum);
          isAPICall = false;
          if (res?.hits?.length > 0) {
            let updatedPageNumber = pageNumber + 1;
            setPageNumber(updatedPageNumber);

            let updatedPost = [...postData, ...res.hits];
            setPostData(updatedPost);
          }
        })
        .catch((error) => {
          isAPICall = false;
          console.log(error);
        });
    }
    // setInterval(() => {
    //   console.log("intervalcall:", pageNumber);
    //   callThePostApi();
    // }, 10000);
  };
  // const interval = setInterval(() => callThePostApi(), 3000);

  const renderPost = ({ item, index }) => {
    return (
      <TouchableHighlight
        onPress={() => navigation.navigate("PostDetail", { postData: item })}
        underlayColor={"transparent"}
      >
        <View style={styles.storyCardContainer}>
          <Text style={styles.cardTitle}>Title</Text>
          <Text style={styles.cardValue}>{item.title}</Text>
          <Text style={styles.cardTitle}>URL</Text>
          <Text style={styles.cardValue}>{item.url}</Text>
          <Text style={styles.cardTitle}>Created at</Text>
          <Text style={styles.cardValue}>
            {Moment(item.created_at).format("DD-MM-YYYY")}
          </Text>
          <Text style={styles.cardTitle}>Author</Text>
          <Text style={styles.cardValue}>{item.author}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={postData}
          renderItem={renderPost}
          extraData={postData}
          onEndReached={() => callThePostApi(pageNumber)}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => item.created_at_i + " " + index}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  storyCardContainer: {
    margin: 16,
    padding: 8,
    paddingBottom: 0,
    borderColor: "#ababab",
    borderWidth: 1,
    borderRadius: 5,
  },
  cardTitle: { fontSize: 14, fontWeight: "bold" },
  cardValue: { fontSize: 14, paddingBottom: 8 },
});
