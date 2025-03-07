import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Paper, Typography, Select, MenuItem } from '@mui/material';
import PoliceTable from './PoliceTable';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const PoliceManager = () => {
  const [officers, setOfficers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [officerData, setOfficerData] = useState({ id: null, name: '', badgeNumber: '', department: '', rank: '', yearsOfService: '' });
  const [editingMode, setEditingMode] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const formattedData = data.map(user => ({
        id: user.id,
        name: user.name,
        badgeNumber: `B${user.id * 100}`,
        department: ['Patrol', 'Homicide', 'Cyber Crime', 'Traffic'][user.id % 4],
        rank: ['Officer', 'Sergeant', 'Lieutenant', 'Captain'][user.id % 4],
        yearsOfService: (user.id % 25) + 1
      }));
      setOfficers(formattedData);
    } catch (error) {
      console.error('Error fetching officers:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOfficerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!officerData.name || !officerData.badgeNumber || !officerData.department || !officerData.rank || !officerData.yearsOfService) {
      alert("Please fill all fields before submitting.");
      return;
    }
    editingMode ? updateOfficer(officerData.id) : addOfficer();
    resetForm();
  };

  const addOfficer = async () => {
    const newOfficer = { id: Date.now(), ...officerData };
    setOfficers([newOfficer, ...officers]);
    await fetch(API_URL, { method: 'POST', body: JSON.stringify(newOfficer) });
  };

  const updateOfficer = async (id) => {
    setOfficers(officers.map(officer => (officer.id === id ? { ...officer, ...officerData } : officer)));
    await fetch(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(officerData) });
  };

  const patchOfficer = async (id, data) => {
    setOfficers(officers.map(officer => (officer.id === id ? { ...officer, ...data } : officer)));
    await fetch(`${API_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  };

  const removeOfficer = async (id) => {
    setOfficers(officers.filter(officer => officer.id !== id));
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  };

  const editOfficer = (officer) => {
    setOfficerData(officer);
    setEditingMode(true);
    if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetForm = () => {
    setOfficerData({ id: null, name: '', badgeNumber: '', department: '', rank: '', yearsOfService: '' });
    setEditingMode(false);
  };

  const filteredOfficers = officers.filter(officer =>
    officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" className="container">
      <Typography variant="h3" align="center">Police Department System</Typography>
      <Paper ref={formRef} elevation={3} className="form-container">
        <form onSubmit={handleFormSubmit}>
          <TextField fullWidth label="Name" name="name" value={officerData.name} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Badge Number" name="badgeNumber" value={officerData.badgeNumber} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Department" name="department" value={officerData.department} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Rank" name="rank" value={officerData.rank} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Years of Service" name="yearsOfService" type="number" value={officerData.yearsOfService} onChange={handleInputChange} margin="normal" />
          <Button type="submit" variant="contained" color="primary">{editingMode ? 'Update' : 'Add'}</Button>
          <Button variant="outlined" onClick={resetForm}>Reset</Button>
        </form>
      </Paper>
      <TextField fullWidth label="Search Officers" variant="outlined" value={searchQuery} onChange={handleSearchChange} margin="normal" />
      <PoliceTable officers={filteredOfficers} editOfficer={editOfficer} removeOfficer={removeOfficer} patchOfficer={patchOfficer} />
    </Container>
  );
};

export default PoliceManager;
