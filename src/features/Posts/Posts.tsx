import React, {FC, useEffect, useState} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, Pressable} from 'react-native';
import {View, Text, Input, Header, Item, Button} from 'native-base';
import axios from 'axios';
import {Post} from 'components';
import {debounce, orderBy} from 'lodash';

const Status = {
  idle: 'idle',
  pending: 'pending',
  rejected: 'rejected',
  resolved: 'resolved',
};

type Props = {
  navigation: any;
};

export const Posts: FC<Props> = ({navigation}) => {
  const [posts, setPosts] = useState<any>([]);
  const [pageNo, setPageNo] = useState(0);

  const [searchedResults, setSearchedResults] = useState<any>([]);
  const [status, setStatus] = useState(Status.idle);
  const [selectedValue, setSelectedValue] = useState('desc');
  const [searchText, setSearchText] = useState('');
  const [searchStatus, setSearchStatus] = useState(Status.idle);

  const [visible, setVisible] = useState(false);

  const apiCall = async () => {
    // console.log('api called for page no #', pageNo);
    setStatus(Status.pending);
    try {
      const res = await axios.get(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNo}`,
      );

      if (res?.data) {
        // console.log('response got for page no #', res.data.page);
        if(res?.data?.page===pageNo){setPosts([...posts, ...res?.data?.hits]);}

        setStatus(Status.resolved);
      }
    } catch (error) {
      // console.log('err', error);
      setStatus(Status.rejected);
    }
  };

  const loadMore = () => {
    setPageNo(prev => prev + 1);
  };

  const reset = () => {
    setSearchedResults([]);
    setSearchStatus(Status.idle);
    setSearchText('');
  };

  const onSearch = debounce((val: string) => {
    if (val && posts.length) {
      setSearchStatus(Status.pending);
      const pattern = `[A-Za-z.\s]*${val.toLowerCase()}[A-Za-z.\s]*`;
      const matchRegEx = new RegExp(pattern);

      const byTitle = posts.filter((data: any) =>
        matchRegEx.test(data.title.toLowerCase()),
      );

      const byAuthor = posts.filter((data: any) =>
        matchRegEx.test(data.author.toLowerCase()),
      );

      const byUrl = posts.filter((data: any) => matchRegEx.test(data.url));
      setSearchedResults([...byTitle, ...byAuthor, ...byUrl]);
      setSearchStatus(Status.resolved);
    } else {
      reset();
    }
  }, 20);

  useEffect(() => {
    apiCall();
  }, [pageNo]);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      setInterval(() => {
        loadMore();
        // console.log('interval aftr 10sec');
      }, 10000);
    }
    return () => {
      isMount = false;
    };
  }, []);

  const onFilter = (order: 'asc' | 'desc') => {
    setSelectedValue(order);
    if (order.match(/none/i)) {
      setSearchedResults([]);
    } else {
      const res = orderBy(posts, o => new Date(o.created_at), order);
      setSearchedResults(res);
    }
    setVisible(false);
  };

  const FooterComp = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          marginVertical: 12,
        }}>
        <ActivityIndicator size="large" color="#999" />
        <Text>Loading Post</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Header searchBar rounded>
              <Item>
                <Input
                  placeholder="Search by title, author, url"
                  onChangeText={e => {
                    onSearch(e);
                    setSearchText(e);
                  }}
                  value={searchText}
                />
                {searchText ? (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      padding: 5,
                    }}
                    onPress={reset}>
                    clear
                  </Text>
                ) : null}
              </Item>
              <Button transparent>
                <Text>Search</Text>
              </Button>
              <Pressable
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    fontWeight: '700',
                    padding: 5,
                  }}
                  onPress={() => setVisible(!visible)}>
                  Filter
                </Text>
              </Pressable>
            </Header>
            {searchStatus === Status.resolved ? (
              <Text style={{textAlign: 'center', paddingVertical: 10}}>
                {searchedResults.length
                  ? 'Results found for'
                  : 'No Result found for'}
                :&nbsp;{searchText}
              </Text>
            ) : null}
          </View>
        }
        data={searchedResults.length > 0 ? searchedResults : posts}
        renderItem={({item, index}) => (
          <Post item={item} index={index} navigation={navigation} />
        )}
        stickyHeaderIndices={[0]}
        initialNumToRender={8}
        onEndReached={loadMore}
        onEndReachedThreshold={0}
        keyExtractor={(_, i) => String(i)}
        ListFooterComponent={FooterComp}
      />
      {visible ? (
        <View style={styles.popup}>
          <Item style={{padding: 10}} onPress={() => onFilter('asc')}>
            <Text style={{fontWeight: selectedValue === 'asc' ? '700' : '400'}}>
              Asc
            </Text>
          </Item>
          <Item style={{padding: 10}} onPress={() => onFilter('desc')}>
            <Text
              style={{fontWeight: selectedValue === 'desc' ? '700' : '400'}}>
              Desc
            </Text>
          </Item>
          <Item
            style={{padding: 10}}
            onPress={() => {
              setVisible(false);
              setSearchedResults([]);
              setSelectedValue('none');
            }}>
            <Text
              style={{fontWeight: selectedValue === 'none' ? '700' : '400'}}>
              None
            </Text>
          </Item>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  popup: {
    width: 100,
    elevation: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 8,
    top: 10,
    right: 10,
  },
});
