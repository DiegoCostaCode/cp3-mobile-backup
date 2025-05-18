
import { View, Text, FlatList, StyleSheet } from 'react-native';

const devs = [
  { id: '1', nome: 'Diego Costa Silva', rm: 'RM552648' },
  { id: '2', nome: 'Maurício Vieira Pereira', rm: 'RM553748' },
  { id: '3', nome: 'Lucas Minozzo Bronzeri', rm: 'RM553745' },
];

export default function Devs() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desenvolvedores</Text>
      <FlatList
        data={devs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.devCard}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.rm}>{item.rm}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  devCard: {
    backgroundColor: '#e2e2e2',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  rm: {
    fontSize: 14,
    color: '#555',
  },
});
