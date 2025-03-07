import React from 'react';
import './PoliceTable.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PoliceTable = ({ officers, editOfficer, removeOfficer, patchOfficer }) => {
  return (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Badge Number</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Rank</TableCell>
            <TableCell>Years of Service</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {officers.map((officer) => (
            <TableRow key={officer.id}>
              <TableCell>{officer.name}</TableCell>
              <TableCell>{officer.badgeNumber}</TableCell>
              <TableCell>{officer.department}</TableCell>
              <TableCell>{officer.rank}</TableCell>
              <TableCell>{officer.yearsOfService}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => editOfficer(officer)}>
                  Edit
                </Button>
                <Button variant="contained" color="secondary" onClick={() => removeOfficer(officer.id)}>
                  Delete
                </Button>
                <Button variant="outlined" color="info" onClick={() => patchOfficer(officer.id, { rank: 'Updated Rank' })}>
                  Promote
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PoliceTable;
