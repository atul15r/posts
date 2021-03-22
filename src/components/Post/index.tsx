import React, {FC} from 'react';
import {Linking} from 'react-native';
import {Content, List, ListItem, Text, View} from 'native-base';
import moment from 'moment';
import {RootStackParamList} from '../navigation/Stack/globalStack';
import {StackNavigationProp} from '@react-navigation/stack';

type PostDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PostDetails'
>;

type Props = {
  navigation: PostDetailsScreenNavigationProp;
  item: any;
  index: number;
};

export const Post: FC<Props> = ({navigation, item}) => {
  return (
    <Content>
      <List>
        <ListItem
          onPress={() => navigation.navigate('PostDetails', {doc: item})}>
          <View>
            <Text style={{color: '#6b6b6b', fontSize: 12}}>
              {moment(item?.created_at).format('lll')}
            </Text>

            <Text>{item?.title}</Text>
            <Text
              style={{
                lineHeight: 27,
                fontSize: 12,
                textTransform: 'capitalize',
              }}>
              Author -&nbsp;
              <Text
                style={{
                  lineHeight: 27,
                  fontWeight: '700',
                  fontSize: 14,
                  textTransform: 'capitalize',
                }}>
                {item?.author}
              </Text>
            </Text>

            <Text
              onPress={() => Linking.openURL(item?.url)}
              style={{color: '#039af4', fontSize: 13}}>
              {item?.url || 'No Url Found'}
            </Text>
          </View>
        </ListItem>
      </List>
    </Content>
  );
};
