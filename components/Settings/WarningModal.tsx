import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface WarningModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function WarningModal({ visible, onConfirm, onCancel }: WarningModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.icon}>
            <AlertTriangle color="#FFB020" size={32} />
          </View>
          <Text style={styles.title}>Warning</Text>
          <Text style={styles.message}>
            Changing the grid size will delete all pictures currently placed on the grid. This action cannot be undone.
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonCancel]} 
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.buttonContinue]} 
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, styles.buttonTextContinue]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#333',
  },
  buttonContinue: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFB020',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonTextContinue: {
    color: '#FFB020',
  },
});