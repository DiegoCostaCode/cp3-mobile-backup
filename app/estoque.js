import { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { CameraView, } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';


export default function Estoque() {

  const { novoProduto } = useLocalSearchParams();

  const produtoPadrao = {
    id: 1,
    nome: 'Produto Padrão',
    dataFab: '01/01/2025',
    prazoVal: '01/12/2025',
    quantidade: 100,
    lote: 'BR1',
    codBarras: '123456789',
    estado: 'SP',
  };

  const barcodeTypes = ['ean13', 'code128', 'upc_a'];

  const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];  

  const [produtos, setProdutos] = useState([produtoPadrao]);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalCameraVisible, setModalCameraVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [nome, setNome] = useState('');
  const [dataFab, setDataFab] = useState('');
  const [prazoVal, setPrazoVal] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [lote, setLote] = useState('');
  const [codBarras, setCodBarras] = useState('');
  const [estado, setEstado] = useState('');
  const [scanned, setScanned] = useState(false);

  useEffect(() => {

    if (novoProduto) {
      try {
        const produtoObj = JSON.parse(novoProduto);
        setProdutos((oldProdutos) => [...oldProdutos, produtoObj]);
      } catch (e) {
        console.error('Erro ao parsear o produto recebido:', e);
      }
    }
  }, [novoProduto]);

  const handleExcluir = (id) => {
    console.log('Tentando excluir produto com id:', id);
    Alert.alert('Excluir', 'Deseja excluir este produto?', [
      { text: 'Cancelar', onPress: () => console.log('Exclusão cancelada') },
      {
        text: 'Sim',
        onPress: () => {
          setProdutos((old) => {
            const novosProdutos = old.filter((p) => p.id !== id);
            console.log('Produto excluído.');
            return novosProdutos;
          });
        },
      },
    ]);
  };

  const handleEditar = (produto) => {
    console.log('Editando produto:', produto.nome);
    setProdutoSelecionado(produto);
    setNome(produto.nome);
    setDataFab(produto.dataFab);
    setPrazoVal(produto.prazoVal);
    setQuantidade(String(produto.quantidade));
    setLote(produto.lote);
    setCodBarras(produto.codBarras);
    setEstado(produto.estado);
    setModalEditVisible(true);
  };

  const handleSalvar = () => {
    const produtoAtualizado = {
      id: produtoSelecionado.id,
      nome,
      dataFab,
      prazoVal,
      quantidade: Number(quantidade),
      lote,
      codBarras,
      estado,
    };

    console.log('Tentando salvar produto:', produtoAtualizado);

    if (!produtoAtualizado.nome || !produtoAtualizado.dataFab || !produtoAtualizado.prazoVal || !produtoAtualizado.quantidade || !produtoAtualizado.lote || !produtoAtualizado.codBarras) {
      console.log('Erro: Campos obrigatórios não preenchidos');
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    } else if (quantidade <= 0) {
      console.log('Erro: Quantidade menor ou igual a zero');
      Alert.alert('Erro', 'Quantidade deve ser maior que zero');
      return;
    } else if (produtoAtualizado.dataFab >= produtoAtualizado.prazoVal) {
      console.log('Erro: Data de fabricação maior ou igual ao prazo de validade');
      Alert.alert('Erro', 'Data de fabricação não pode ser maior ou igual que o prazo de validade');
      return;
    }

    setProdutos((oldProdutos) => {
      const novosProdutos = oldProdutos.map((produto) =>
        produto.id === produtoSelecionado.id ? produtoAtualizado : produto
      );
      console.log('Produto salvo.');
      return novosProdutos;
    });

    setModalEditVisible(false);
    console.log('Modal de edição fechado');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoque</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.produtoCard}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Fabricado: {item.dataFab}</Text>
            <Text>Validade: {item.prazoVal}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
            <Text>Lote: {item.lote}</Text>
            <Text>Código de barras: {item.codBarras}</Text>
            <Text>Estado: {item.estado}</Text>
            <View style={styles.btns}>
              <Button title="Editar" onPress={() => handleEditar(item)} />
              <Button title="Excluir" color="red" onPress={() => handleExcluir(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Modal de Edição */}
      <Modal visible={modalEditVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Produto</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
          <TextInput style={styles.input} value={dataFab} onChangeText={setDataFab} placeholder="Data de fabricação" />
          <TextInput style={styles.input} value={prazoVal} onChangeText={setPrazoVal} placeholder="Prazo de validade" />
          <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="Quantidade" />
          <TextInput style={styles.input} value={lote} onChangeText={setLote} placeholder="Lote" />
          <TextInput style={styles.input} value={codBarras} onChangeText={setCodBarras} placeholder="Código de barras" />

          <TouchableOpacity onPress={() => { setModalCameraVisible(true); setScanned(false); }} style={{ marginBottom: 10 }}>
            <MaterialCommunityIcons name="barcode-scan" size={28} color="#007aff" />
          </TouchableOpacity>

          <View style={styles.pickerInput}>
            <Picker
              selectedValue={estado}
              onValueChange={(itemValue) => setEstado(itemValue)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Selecione o estado" value="" />
              {estados.map((uf) => (
                <Picker.Item key={uf} label={uf} value={uf} />
              ))}
            </Picker>
          </View>

          <View style={styles.modalBtns}>
            <Button title="Salvar" onPress={handleSalvar} color="green" />
            <Button title="Cancelar" onPress={() => setModalEditVisible(false)} color="red" />
          </View>
        </View>
      </Modal>

      {/* Modal da Câmera */}
      <Modal visible={modalCameraVisible} animationType="slide">
        <View style={styles.modalCamContainer}>
          <CameraView
            barcodeScannerSettings={{ barcodeTypes }}
            onBarcodeScanned={(barcode) => {
              if (!scanned) {
                setScanned(true);
                setCodBarras(barcode.data);
                setModalCameraVisible(false);
                Alert.alert('Código detectado', barcode.data);
              }
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cancelButton}>
            <Button title="Fechar" onPress={() => setModalCameraVisible(false)} />
          </View>
        </View>
      </Modal>
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
  produtoCard: {
    backgroundColor: '#e6e6e6',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalCamContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
  },
  pickerInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  
});
