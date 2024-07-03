import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Container,
    Button,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const getServices = async () => {
            const rep = await fetch(`https://6660044b5425580055b1c21d.mockapi.io/Assignment/Course`);
            const data = await rep.json();
            setServices(data);
        };
        getServices();
    }, []);

    const handleOnClick = (service) => {
        navigate(`/Service/${service.name}`)
    }

    return (
        <Container sx={{ mt: 14, mb: 14 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    List of Services
                </Typography>
            </Box>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Service Name</TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>Price ($)</TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>Execution Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id} hover>
                                <TableCell>
                                    <Button
                                        onClick={() => handleOnClick(service)}
                                        sx={{
                                            textTransform: 'none',
                                            color: 'primary.main',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {service.name}
                                    </Button>
                                </TableCell>
                                <TableCell align="right">{service.price}</TableCell>
                                <TableCell align="right">{service.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ServiceList;
