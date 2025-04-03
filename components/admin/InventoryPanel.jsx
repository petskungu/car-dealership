import { useState, useEffect } from 'react';
import { Table, Button, Form, Badge } from 'react-bootstrap';
import api from '../../utils/api';
import CarStatusModal from './CarStatusModal';

const InventoryPanel = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    status: ''
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (searchParams.make) params.append('make', searchParams.make);
      if (searchParams.model) params.append('model', searchParams.model);
      if (searchParams.status) params.append('status', searchParams.status);
      
      const response = await api.get(`/api/v1/admin/inventory?${params.toString()}`);
      setInventory(response.data.data);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [searchParams]);

  const handleStatusChange = (car) => {
    setSelectedCar(car);
    setShowStatusModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      in_stock: 'success',
      reserved: 'warning',
      sold: 'secondary',
      maintenance: 'danger'
    };
    return <Badge bg={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="inventory-panel">
      <div className="search-filters mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Make</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Filter by make"
            value={searchParams.make}
            onChange={(e) => setSearchParams({...searchParams, make: e.target.value})}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Model</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Filter by model"
            value={searchParams.model}
            onChange={(e) => setSearchParams({...searchParams, model: e.target.value})}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select 
            value={searchParams.status}
            onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="maintenance">Maintenance</option>
          </Form.Select>
        </Form.Group>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Make/Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((car) => (
              <tr key={car._id}>
                <td>{car.make} {car.model}</td>
                <td>{car.year}</td>
                <td>${car.price.toLocaleString()}</td>
                <td>{getStatusBadge(car.status)}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleStatusChange(car)}
                  >
                    Change Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <CarStatusModal 
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        car={selectedCar}
        refreshInventory={fetchInventory}
      />
    </div>
  );
};

export default InventoryPanel;