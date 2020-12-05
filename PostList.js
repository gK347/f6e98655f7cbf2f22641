import Moment from "moment";
import React, { useEffect, useState } from "react";
import { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
} from "react-native";

export default class PostList extends Component {
  state = {
    pageNumber: 0,
    postData: [],
    isAPICall: false,
  };

  componentDidMount() {
    let { pageNumber } = this.state;
    this.callThePostApi();
    setInterval(() => this.callThePostApi(), 3000);
  }

  callThePostApi = () => {
    let { pageNumber, postData, isAPICall } = this.state;
    if (!isAPICall) {
      this.setState({
        isAPICall: true,
      });
      const url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`;
      fetch(url)
        .then((response) => response.json())
        .then((res) => {
          // isAPICall = false;
          if (res?.hits?.length > 0) {
            let updatedPageNumber = pageNumber + 1;
            // setPageNumber(updatedPageNumber);

            let updatedPost = [...postData, ...res.hits];
            // setPostData(updatedPost);
            this.setState({
              isAPICall: false,
              pageNumber: updatedPageNumber,
              postData: updatedPost,
            });
          }
        })
        .catch((error) => {
          isAPICall = false;
          console.log(error);
        });
    }
  };

  renderPost = ({ item, index }) => {
    return (
      <TouchableHighlight
        onPress={() =>
          this.props.navigation.navigate("PostDetail", { postData: item })
        }
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

  render() {
    let { postData, pageNumber } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={postData}
            renderItem={this.renderPost}
            extraData={postData}
            onEndReached={() => this.callThePostApi()}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => item.created_at_i + " " + index}
          />
        </View>
      </SafeAreaView>
    );
  }
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
