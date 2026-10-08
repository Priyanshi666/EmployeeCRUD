import React, { useState, useEffect } from 'react';
import {  View,  Text, StyleSheet,  Pressable,  Modal,  TextInput,  FlatList,  useWindowDimensions,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// View, Text, StyleSheet, Pressable aur Modal React Native se import kiye

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  const [modalVisible, setModalVisible] = useState(false);

  // false = Modal closed
  // true = Modal open
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const savedEmployees = await AsyncStorage.getItem('employees');

    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null); // View ke liye selected employee
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleDelete = async (id) => {
    const updatedEmployees = employees.filter(
      (employee) => employee.id !== id
    );

    setEmployees(updatedEmployees);

    await AsyncStorage.setItem(
      'employees',
      JSON.stringify(updatedEmployees)
    );
  };
  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.departmentId}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
  return (
    <View style={styles.container}>
   <View style={styles.topBox}>
        <View
          style={[
            styles.header,
            isMobile && styles.mobileHeader,
          ]}
        >
          <View style={styles.headerText}>

            <Text style={styles.title}>
              Employee Management
   </Text>
   <Text style={styles.subtitle}>
      Manage your employees easily
         </Text>
   </View>
    <Pressable
            onPress={() => {
              setEditingEmployee(null);
              setFirstName('');
              setLastName('');
              setEmail('');
              setDepartmentId('');
              setModalVisible(true);
            }}
            style={[
              styles.addButton,
              isMobile && styles.mobileAddButton,
            ]}
          >
  <Text style={styles.addButtonText}>
   + Add Employee
            </Text>
          </Pressable>
  </View>
        <View style={styles.searchBox}>

          <Text style={styles.searchIcon}>
            🔍
          </Text>
          <TextInput
            placeholder="Search by name or department..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
<View style={styles.viewModalOverlay}>
          <View style={styles.modalContainer}>

 <Text style={styles.modalTitle}>
 {editingEmployee ? 'Edit Employee' : 'Add Employee'}
    </Text>
<Text style={styles.label}>
    First Name
       </Text>
            <TextInput
              placeholder="Enter first name"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
            <Text style={styles.label}>
              Last Name
            </Text>
            <TextInput
              placeholder="Enter last name"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
  <Text style={styles.label}>
     Email
   </Text>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.label}>
              Department ID
            </Text>
   <TextInput
  placeholder="Enter department ID"
    placeholderTextColor="#94A3B8"
        style={styles.input}
          value={departmentId}
  onChangeText={setDepartmentId}
       />
            <View style={styles.formButtons}>
              <Pressable
                style={styles.submitButton}
                onPress={async () => {

     if (editingEmployee) {
  const updatedEmployees = employees.map((employee) =>
         employee.id === editingEmployee.id
            ? {
         ...employee,
         firstName: firstName,
         lastName: lastName,
           email: email,
        departmentId: departmentId,
             }
          : employee
           );
        setEmployees(updatedEmployees);
       await AsyncStorage.setItem(
            'employees',
            JSON.stringify(updatedEmployees)
          );
        setEditingEmployee(null);
 } else {
                    const newEmployee = {
                      id: Date.now(),
                      firstName: firstName,
                      lastName: lastName,
                      email: email,
                      departmentId: departmentId,
                    };

      const updatedEmployees = [
          ...employees,
    newEmployee,
  ];

    setEmployees(updatedEmployees);
       await AsyncStorage.setItem(
       'employees',
      JSON.stringify(updatedEmployees)
          );
          }
       setFirstName('');
     setLastName('');
 setEmail('');
     setDepartmentId('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>
                  {editingEmployee ? 'Update' : 'Submit'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.cancelEditButton}
                onPress={() => {
                  setEditingEmployee(null);
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setDepartmentId('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelEditText}>
                  Cancel
                </Text>
              </Pressable>
      </View>
    </View>
  </View>
      </Modal>
      <Modal
        visible={selectedEmployee !== null}
        transparent
        animationType="fade"
      >
   <View style={styles.viewModalOverlay}>

   <View style={styles.viewModalBox}>

      <Text style={styles.viewModalTitle}>
              Employee Details
    </Text>

            <View style={styles.detailsBox}>

              <Text style={styles.detailLabel}>
                First Name
              </Text>

              <Text style={styles.detailText}>
                {selectedEmployee?.firstName}
              </Text>

              <Text style={styles.detailLabel}>
                Last Name
              </Text>

              <Text style={styles.detailText}>
                {selectedEmployee?.lastName}
              </Text>

              <Text style={styles.detailLabel}>
                Email
              </Text>

              <Text style={styles.detailText}>
                {selectedEmployee?.email}
              </Text>

              <Text style={styles.detailLabel}>
                Department ID
              </Text>

              <Text style={styles.detailText}>
                {selectedEmployee?.departmentId}
              </Text>

            </View>

            <Pressable
              onPress={() => setSelectedEmployee(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>
                Close
              </Text>
       </Pressable>
     </View>
  </View>
      </Modal>
      <Modal
        visible={deleteId !== null}
        transparent
        animationType="fade"
      >
        <View style={styles.deleteModalOverlay}>

          <View style={styles.deleteModalBox}>

            <Text style={styles.deleteModalTitle}>
              Delete Employee
            </Text>

            <Text style={styles.deleteModalText}>
              Are you sure you want to delete this employee?
            </Text>

            <View style={styles.deleteModalButtons}>

              <Pressable
                onPress={() => setDeleteId(null)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={async () => {

                  if (deleteId !== null) {
                    await handleDelete(deleteId);
                  }

                  setDeleteId(null);
                }}
                style={styles.confirmDeleteButton}
              >
                <Text style={styles.confirmDeleteText}>
                  Delete
             </Text>
        </Pressable>
    </View>
</View>
</View>
      </Modal>
      <View style={styles.dataSection}>

        <Text style={styles.dataTitle}>
          Employee Data Table
        </Text>

        {isMobile ? (
          <FlatList
            data={filteredEmployees}
            contentContainerStyle={styles.mobileList}
            keyExtractor={(item) => item.id.toString()}

            renderItem={({ item }) => (

              <View style={styles.employeeCard}>
                <View style={styles.employeeHighlight}>

                  <Text style={styles.employeeHighlightName}>
                    {item.firstName} {item.lastName}
                  </Text>
                </View>

                <View style={styles.cardField}>

                  <Text style={styles.cardLabel}>
                    Email
                  </Text>

                  <Text style={styles.cardValue}>
                    {item.email}
                  </Text>

                </View>

                <View style={styles.cardField}>

                  <Text style={styles.cardLabel}>
                    Department
                  </Text>

                  <Text style={styles.departmentBadge}>
                    {item.departmentId}
                  </Text>
                </View>
                <View style={styles.mobileActions}>
                  <Pressable
                    onPress={() => setSelectedEmployee(item)}
                    style={styles.viewButton}
                  >
                    <Text style={styles.viewText}>
                      View
                    </Text>
                  </Pressable>
   <Pressable
  onPress={() => {
    setEditingEmployee(item);
   setFirstName(item.firstName);
    setLastName(item.lastName);
        setEmail(item.email);
    setDepartmentId(item.departmentId);
 setModalVisible(true);
      }}
     style={styles.editButton}
          >
   <Text style={styles.editText}>
    Edit
   </Text>
      </Pressable>
     <Pressable
   onPress={() => setDeleteId(item.id)}
    style={styles.deleteButton}
  >
     <Text style={styles.deleteText}>
        Delete
       </Text>
   </Pressable>
  </View>
   </View>
  )}
     ListEmptyComponent={
              <View style={styles.emptyBox}>
 <Text style={styles.emptyTitle}>
       No employees found
   </Text>
  <Text style={styles.emptyText}>
      Add an employee to see the details here.
       </Text>
 </View>
      }
     />
    ) : (
     <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.nameColumn]}>
                Name
              </Text>
              <Text style={[styles.tableHeaderText, styles.emailColumn]}>
                Email
              </Text>
              <Text style={[styles.tableHeaderText, styles.departmentColumn]}>
                Department
           </Text>
              <Text style={[styles.tableHeaderText, styles.actionColumn]}>
                Actions
              </Text>

            </View>
            <FlatList
              contentContainerStyle={styles.listContent}
              data={filteredEmployees}

       renderItem={({ item }) => (
   <View style={styles.tableRow}>
       <View style={styles.nameColumn}>
         <Text
        style={styles.employeeName}
    numberOfLines={1}
       >
       {item.firstName} {item.lastName}
 </Text>
   </View>
    <View style={styles.emailColumn}>
       <Text
       style={styles.employeeEmail}
        numberOfLines={1}
        >
    {item.email}
      </Text>
       </View>    
   <View style={styles.departmentColumn}>
 <Text style={styles.departmentBadge}>
        {item.departmentId}
       </Text>
  </View>
           <View style={styles.actionColumn}>
           <Pressable
     onPress={() => setSelectedEmployee(item)}
         style={styles.viewButton}
  >
                      <Text style={styles.viewText}>
                        View
                      </Text>
                    </Pressable>
       <Pressable
       onPress={() => {
           setEditingEmployee(item);
           setFirstName(item.firstName);
         setLastName(item.lastName);
                        setEmail(item.email);
        setDepartmentId(item.departmentId);
        setModalVisible(true);
   }}
 style={styles.editButton}
     >
 <Text style={styles.editText}>
       Edit
   </Text>
</Pressable>
 <Pressable
   onPress={() => setDeleteId(item.id)}
       style={styles.deleteButton}
                    >
       <Text style={styles.deleteText}>
             Delete
            </Text>
 </Pressable>
  </View>         
    </View>
  )}

   keyExtractor={(item) => item.id.toString()}

   ListEmptyComponent={

                <View style={styles.emptyBox}>

                  <Text style={styles.emptyTitle}>
                           No employees found
    </Text>
 <Text style={styles.emptyText}>
 Add an employee to see the details here.
    </Text>
  </View>

   }
  />
 </View>
  )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  topBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },

  mobileHeader: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileAddButton: {
    width: '100%',
    marginTop: 15,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F8FAFC',
    height: 50,
  },

  searchIcon: {
    fontSize: 17,
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 0,
  },
  dataSection: {
    flex: 1,
  },

  dataTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 30,
  },

  tableContainer: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    paddingHorizontal: 18,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  nameColumn: {
    flex: 1.2,
    paddingRight: 20,
  },
  emailColumn: {
    flex: 1.8,
    paddingRight: 20,
  },
  departmentColumn: {
    flex: 0.8,
    paddingRight: 15,
  },
  actionColumn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },

  employeeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  employeeEmail: {
    fontSize: 14,
    color: '#475569',
  },
  departmentBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },

  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editText: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 13,
  },

  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
  mobileList: {
    paddingBottom: 30,
  },

  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },

  // Employee name highlight
  employeeHighlight: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    borderRadius: 7,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  employeeHighlightName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  cardField: {
    marginBottom: 13,
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 5,
    textTransform: 'uppercase',
  },

  cardValue: {
    fontSize: 15,
    color: '#0F172A',
  },
  mobileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 5,
    flexWrap: 'nowrap',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
  },

  modalTitle: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#0F172A',
  },
  formButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
  },

  submitButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelEditButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },

  cancelEditText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },

  viewModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },

  viewModalBox: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
  },

  viewModalTitle: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 9,
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },

  detailsBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 17,
    backgroundColor: '#F8FAFC',
  },

  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },

  detailText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    marginTop: 3,
    marginBottom: 8,
  },

  closeButton: {
    backgroundColor: '#475569',
    paddingVertical: 11,
    borderRadius: 8,
    marginTop: 18,
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334155',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  deleteModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  deleteModalBox: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },

  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  deleteModalText: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 10,
  },

  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },

  cancelText: {
    color: '#475569',
    fontWeight: '600',
  },

  confirmDeleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});