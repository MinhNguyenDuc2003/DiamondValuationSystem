import React, { useEffect, useState } from 'react';
import {
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Valuation from './img/Valuation.jpg'
import Appraisal from './img/Appraisal.jpg'
import Sculpture from './img/Sculpture.jpg'
const ServiceList = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getServices = async () => {
            try {
                const response = await fetch(`https://6660044b5425580055b1c21d.mockapi.io/Assignment/Course`);
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        getServices();
    }, []);

    const handleOnClick = (service) => {
        navigate(`/Service/${service.name}`);
    };

    const ServiceCard = ({ service }) => {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                {service.name === 'Valuation' && (
                    <CardMedia
                        component="img"
                        height="140"
                        image={Valuation}
                        alt="green iguana"
                    />
                )}
                {service.name === 'Sculpture' && (
                    <CardMedia
                        component="img"
                        height="140"
                        image={Sculpture}
                        alt="green iguana"
                    />
                )}
                {service.name === 'Appraisal' && (
                    <CardMedia
                        component="img"
                        height="140"
                        image={Appraisal}
                        alt="green iguana"
                    />
                )}
                <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                        {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Price:</strong> ${service.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Execution Time:</strong> {service.time} hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {service.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => handleOnClick(service)}>
                        Learn More
                    </Button>
                </CardActions>
            </Card>
        );
    };

    return (
        <Container sx={{ mt: 14 ,mb: 14}}>
            <Typography variant="h4" component="h1" mb={4}>
                List of Services
            </Typography>
            <Grid container spacing={7}>
                {services.map((service, index) => (
                    <Grid item sm={6} key={service.id}>
                        <ServiceCard service={service} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ServiceList;
