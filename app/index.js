import { useState, useEffect } from 'react';
import { Text, TextInput, Button, ScrollView, StyleSheet, Alert, View, Modal, TouchableOpacity, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { CameraView, useCameraPermissions  } from 'expo-camera';
import { useRouter } from 'expo-router';

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const barcodeTypes = ['ean13', 'code128', 'upc_a']

export default function Home() {
  
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [dataFab, setDataFab] = useState('');
  const [prazoVal, setPrazoVal] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [lote, setLote] = useState('');
  const [codBarras, setCodBarras] = useState('');
  const [estado, setEstado] = useState(estados[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissaoCamera, requestPermissaoCamera] = useCameraPermissions()
  const [scanned, setScanned] = useState(false);

  const handleSalvar = () => {

    console.log('Salvando produto:', {
      nome,
    });

    console.log('Analisando dados');
    if (!nome || !dataFab || !prazoVal || !quantidade || !lote || !codBarras) {
      console.log('Dados incompletos');
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    } else if (quantidade <= 0) {
      console.log('Quantidade inválida');
      Alert.alert('Erro', 'Quantidade deve ser maior que zero');
      return;
    } else if (dataFab >= prazoVal) {
      console.log('Data de fabricação maior que prazo de validade');
      Alert.alert('Erro', 'Data de fabricação não pode ser maior ou igual que o prazo de validade');
      return;
    }

    const novoProduto = {
      id: Date.now().toString(),
      nome,
      dataFab,
      prazoVal,
      quantidade,
      lote,
      codBarras,
      estado,
    };
    
    router.push({
      pathname: '/estoque',
      params: { novoProduto: JSON.stringify(novoProduto) }
    });

    console.log('Produto salvo!');
    Alert.alert('Sucesso', `Produto ${nome} salvo!`);


    setNome('');
    setDataFab('');
    setPrazoVal('');
    setQuantidade('');
    setLote('');
    setCodBarras('');
    setEstado(estados[0]);
  };

  const handleScanBarCode = async () => {
    console.log('Solicitando permissão da câmera');
    const { granted } = await requestPermissaoCamera();
    console.log('Permissão concedida?', granted);
    if (!granted) {
      Alert.alert('Permissão necessária', 'Você precisa permitir o uso da câmera.');
      return;
    }
    setScanned(false);
    setModalVisible(true);
    console.log('Modal visível:', true);
  };

  function formatarDataDigitacao(text) {

    let digits = text.replace(/\D/g, '');

    if (digits.length > 8) {
      digits = digits.slice(0, 8);
    }

    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    } else {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Data de Fabricação (dd/mm/aaaa)</Text>
      <TextInput
        style={styles.input}
        value={dataFab}
        onChangeText={(data) => setDataFab(formatarDataDigitacao(data))}
        keyboardType="numeric"
        maxLength={10}
        placeholder="dd/mm/aaaa"
      />

      <Text style={styles.label}>Prazo de Validade (dd/mm/aaaa)</Text>
      <TextInput
        style={styles.input}
        value={prazoVal}
        onChangeText={(data) => setPrazoVal(formatarDataDigitacao(data))}
        keyboardType="numeric"
        maxLength={10}
        placeholder="dd/mm/aaaa"
      />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        placeholder="Quantidade"
      />

      <Text style={styles.label}>Lote</Text>
      <TextInput
        style={styles.input}
        value={lote}
        onChangeText={setLote}
        placeholder="Lote (letras e números)"
      />

      <Text style={styles.label}>Código de Barras</Text>
      <View style={styles.codBarrasContainer}>
        <TextInput
          style={styles.codBarrasInput}
          value={codBarras}
          onChangeText={setCodBarras}
          placeholder="Código de barras"
        />
        <TouchableOpacity onPress={handleScanBarCode} style={{ padding: 8 }}>
          <MaterialCommunityIcons name="barcode-scan" size={28} color="#007aff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Estado de Origem</Text>
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

      <Button title="Salvar Produto" onPress={handleSalvar} color="green"/>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: barcodeTypes,
            }}
            onBarcodeScanned={(barcode) => {
              console.log('Barcode detectado:', barcode);
              if (!scanned) {
                const codigo = barcode.data;
                console.log('Código detectado:', codigo);
                if (codigo) {
                  setScanned(true);
                  setCodBarras(codigo);
                  setModalVisible(false);
                  Alert.alert('Código de Barras', `Valor detectado: ${codigo}`);
                }
              } else {
                console.log('Código já escaneado');
              }
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cancelButton}>
            <Button
              title="Fechar"
              onPress={() => {
                setModalVisible(false);
                setScanned(false);
              }}
            />
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    marginTop: 5,
    borderRadius: 4,
    width: '100%',
  },
  picker: {
    marginVertical: 10,
  },
  modalContainer: {
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
  codBarrasContainer: {
    width: '100%',
    gap: 10,
  },
  codBarrasInput: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    borderRadius: 4,
    width: '100%',
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

