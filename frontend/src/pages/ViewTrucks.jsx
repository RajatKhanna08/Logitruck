import React, { useState, useEffect } from 'react';
import {
  Truck, Plus, Search, Eye, Edit, Trash2, FileText, Upload, Power, PowerOff,
  Calendar, User, MapPin, AlertTriangle, CheckCircle, XCircle, Download,
  Filter, RefreshCw, Settings
} from 'lucide-react';

const ViewTrucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]); // Fetched list of drivers
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVehicleType, setFilterVehicleType] = useState('all');
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [showAddTruckModal, setShowAddTruckModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for the document upload modal
  const [documentsToUpload, setDocumentsToUpload] = useState({
    rcBook: null,
    insurance: null,
    pollutionCertificate: null,
  });

  // Vehicle type options matching the backend enum
  const vehicleTypes = [
    { value: 'open', label: 'Open Body' },
    { value: 'container', label: 'Container' },
    { value: 'tipper', label: 'Tipper' },
    { value: 'flatbed', label: 'Flatbed' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'reefer', label: 'Reefer' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'mini-truck', label: 'Mini Truck' }
  ];

  // API Base URL - Update this according to your backend
  const API_BASE_URL = 'http://localhost:5000/api/transporter';

  // API Helper using cookie-based auth
  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: 'include', // Sends cookies with requests
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error('API call failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Route 1: GET /truck/my - Get My Trucks
  const fetchMyTrucks = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/truck/my');
      setTrucks(data.trucks || []);
    } catch (error) {
      console.error('Error fetching trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Route 2: GET /driver/my - Get My Drivers (Now crucial for populating dropdown)
  const fetchMyDrivers = async () => {
    try {
      const data = await apiCall('/driver/my');
      setDrivers(data.drivers || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  // Route 3: POST /truck/add - Add Truck
  const addTruck = async (truckData, documents) => {
    setLoading(true);
    setError('');
    setShowAddTruckModal(false);

    try {
      const response = await apiCall('/truck/add', {
        method: 'POST',
        body: JSON.stringify(truckData),
      });
      const newServerTruck = response.truck;

      // Upload documents if any
      const formData = new FormData();
      let hasFiles = false;
      if (documents.rcBook) {
        formData.append('rcBook', documents.rcBook);
        hasFiles = true;
      }
      if (documents.insurance) {
        formData.append('insurance', documents.insurance);
        hasFiles = true;
      }
      if (documents.pollutionCertificate) {
        formData.append('pollutionCertificate', documents.pollutionCertificate);
        hasFiles = true;
      }

      if (hasFiles) {
        await uploadTruckDocuments(newServerTruck._id, formData);
      }
      await fetchMyTrucks();

    } catch (error) {
      console.error('Failed to add truck:', error);
    } finally {
      setLoading(false);
    }
  };

  // Route 4: GET /truck/:truckId - Get Truck By ID
  const fetchTruckById = async (truckId) => {
    setLoading(true);
    setSelectedTruck(null);
    try {
      const data = await apiCall(`/truck/${truckId}`);
      setSelectedTruck(data.truck);
    } catch (error) {
      setError('Failed to fetch truck details. Please try again later.');
      console.error('Error fetching truck by ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // Route 5: PUT /truck/:truckId - Update Truck Details with Persistence
  const updateTruckDetails = async (truckId, updateData) => {
    setLoading(true);
    setShowEditModal(false);
    try {
      await apiCall(`/truck/${truckId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      await fetchMyTrucks();
    } catch (error) {
      console.error('Error updating truck:', error);
    } finally {
      setLoading(false);
      setSelectedTruck(null);
    }
  };

  // Route 6: POST /truck/upload-docs/:truckId - Upload Truck Documents
  const uploadTruckDocuments = async (truckId, formData) => {
    setLoading(true);
    setError('');
    try {
        const response = await fetch(`${API_BASE_URL}/truck/upload-docs/${truckId}`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to upload documents.');
        }

        setTrucks(currentTrucks =>
            currentTrucks.map(t => t._id === truckId ? data.truck : t)
        );

        if(selectedTruck && selectedTruck._id === truckId) {
            setSelectedTruck(data.truck);
        }

        return true;
    } catch (err) {
        console.error('Error uploading documents:', err);
        setError(err.message);
        return false;
    } finally {
        setLoading(false);
    }
  };

  // Route 7: PUT /truck/driver-ref/:truckId - Update Driver Reference (This route will be less directly used from frontend now)
  const updateDriverReference = async (truckId, driverId) => {
    setLoading(true);
    try {
      const response = await apiCall(`/truck/driver-ref/${truckId}`, {
        method: 'PUT',
        body: JSON.stringify({ assignedDriverId: driverId })
      });

      const updatedTrucks = trucks.map(t =>
        t._id === truckId ? response.truck : t
      );

      setTrucks(updatedTrucks);

      if(selectedTruck) {
        setSelectedTruck(response.truck);
      }
    } catch (error) {
      console.error('Error updating driver reference:', error);
    } finally {
        setLoading(false);
    }
  };

  // Route 8: PUT /truck/activate/:truckId - Activate Truck
  const activateDeactivateTruck = async(truckId, currentStatus) => {
    setLoading(true);
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';
    try {
      await apiCall(`/truck/${action}/${truckId}`, { method: 'PUT' });
      await fetchMyTrucks();
    } catch (error) {
      console.error(`Error ${action}ing truck:`, error);
    } finally {
        setLoading(false);
    }
  };

  // Route 9: PUT /truck/deactivate/:truckId - Deactivate Truck
  const deactivateTruck = async (truckId) => {
    setLoading(true);
    try {
      await apiCall(`/truck/deactivate/${truckId}`, {
        method: 'PUT'
      });
      await fetchMyTrucks();
    } catch (error) {
      console.error('Error deactivating truck:', error);
    } finally {
        setLoading(false);
    }
  };

  // Route 10: DELETE /truck/:truckId - Delete Truck
  const deleteTruck = async (truckId) => {
    if (!window.confirm('Are you sure you want to delete this truck? This action cannot be undone.')) return;

    setLoading(true);
    try {
      await apiCall(`/truck/${truckId}`, { method: 'DELETE' });
      await fetchMyTrucks();
    } catch (error) {
      console.error('Error deleting truck:', error);
    } finally {
      setLoading(false);
      setSelectedTruck(null);
    }
  };

  useEffect(() => {
    fetchMyTrucks();
    fetchMyDrivers(); // Fetch drivers when component mounts
  }, []);

  // Filter trucks based on search and filters
  useEffect(() => {
    let filtered = trucks;

    if (searchTerm) {
      filtered = filtered.filter(truck =>
        truck.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (truck.assignedDriverId &&
            // Adjust search to match driver's full name if populated, or ID if not.
            (typeof truck.assignedDriverId === 'object' && truck.assignedDriverId.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (typeof truck.assignedDriverId === 'string' && truck.assignedDriverId.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(truck => truck.status === filterStatus);
    }

    if (filterVehicleType !== 'all') {
      filtered = filtered.filter(truck => truck.vehicleType === filterVehicleType);
    }

    setFilteredTrucks(filtered);
  }, [searchTerm, filterStatus, filterVehicleType, trucks]);

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'blocked': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVehicleTypeIcon = (type) => {
    return <Truck className="w-6 h-6" />;
  };

  const isDocumentExpiring = (dateString) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysToExpiry > 0 && daysToExpiry <= 30;
  };

  const getDriverNameOrId = (driverId) => {
    if (!driverId) return 'Not Assigned';
    // If assignedDriverId is an object, it means it's populated.
    // If it's a string, it means it's just the ID.
    if (typeof driverId === 'object' && driverId.fullName) {
      return driverId.fullName;
    }
    // Try to find the driver in the fetched drivers list (if populated on initial fetch)
    const driver = drivers.find(d => d._id === driverId);
    return driver ? driver.fullName : String(driverId); // Return the ID if name not found
  };


  // Add Truck Modal Component - Updated to use assignedDriverId as text input
  const AddTruckModal = () => {
    const [formData, setFormData] = useState({
      registrationNumber: '',
      brand: '',
      model: '',
      vehicleType: '',
      capacityInTon: '',
      capacityInCubicMeters: '',
      pollutionCertificateValidTill: '',
      insuranceValidTill: '',
      assignedDriverId: '' // This will now be populated from dropdown
    });

    const [documents, setDocuments] = useState({
      rcBook: null,
      insurance: null,
      pollutionCertificate: null
    });

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleFileChange = (docType, file) => {
      setDocuments(prev => ({
        ...prev,
        [docType]: file
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const truckData = {
        registrationNumber: formData.registrationNumber.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        vehicleType: formData.vehicleType,
        capacityInTon: parseFloat(formData.capacityInTon),
        capacityInCubicMeters: parseFloat(formData.capacityInCubicMeters),
        pollutionCertificateValidTill: formData.pollutionCertificateValidTill,
        insuranceValidTill: formData.insuranceValidTill || null,
        assignedDriverId: formData.assignedDriverId // Send selected driver ID (should be ObjectId string)
      };

      console.log('Submitting truck data:', truckData);
      await addTruck(truckData, documents);

      // Reset form
      setFormData({
        registrationNumber: '',
        brand: '',
        model: '',
        vehicleType: '',
        capacityInTon: '',
        capacityInCubicMeters: '',
        pollutionCertificateValidTill: '',
        insuranceValidTill: '',
        assignedDriverId: ''
      });
      setDocuments({
        rcBook: null,
        insurance: null,
        pollutionCertificate: null
      });
    };

    return (
      <div className="absolute top-0 left-0 w-full min-h-full bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 z-[1000] py-8">
        <div className="mx-auto bg-white rounded-lg p-6 w-full max-w-2xl transform scale-95 opacity-100 transition-all duration-200 ease-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800 flex items-center space-x-2">
              <Plus className="w-6 h-6" />
              <span>Add New Truck</span>
            </h2>
            <button onClick={() => setShowAddTruckModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Registration Number *"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Brand *"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Model *"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={formData.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Vehicle Type *</option>
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Capacity in Tons *"
                value={formData.capacityInTon}
                onChange={(e) => handleInputChange('capacityInTon', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.1"
                step="0.1"
                required
              />
              <input
                type="number"
                placeholder="Capacity in Cubic Meters *"
                value={formData.capacityInCubicMeters}
                onChange={(e) => handleInputChange('capacityInCubicMeters', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.1"
                step="0.1"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pollution Certificate Valid Till *
                </label>
                <input
                  type="date"
                  value={formData.pollutionCertificateValidTill}
                  onChange={(e) => handleInputChange('pollutionCertificateValidTill', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Valid Till
                </label>
                <input
                  type="date"
                  value={formData.insuranceValidTill}
                  onChange={(e) => handleInputChange('insuranceValidTill', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Driver Selection Dropdown - CRITICAL CHANGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Driver *
                </label>
                <select
                  value={formData.assignedDriverId}
                  onChange={(e) => handleInputChange('assignedDriverId', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required // Make this required if assignedDriverId is required in the model
                >
                  <option value="">Select a Driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.fullName} ({driver.phone})
                    </option>
                  ))}
                </select>
                {drivers.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">No drivers available. Please add drivers first.</p>
                )}
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Upload Documents (Optional for initial add)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RC Book</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('rcBook', e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {documents.rcBook && (
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {documents.rcBook.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('insurance', e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {documents.insurance && (
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {documents.insurance.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pollution Certificate</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('pollutionCertificate', e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {documents.pollutionCertificate && (
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {documents.pollutionCertificate.name}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, JPG, JPEG, PNG (Max 5MB each)
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAddTruckModal(false)}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{loading ? 'Adding...' : 'Add Truck'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit Truck Modal Component - Updated to use assignedDriverId as text input
  const EditTruckModal = () => {
    const [formData, setFormData] = useState({
      registrationNumber: selectedTruck?.registrationNumber || '',
      brand: selectedTruck?.brand || '',
      model: selectedTruck?.model || '',
      vehicleType: selectedTruck?.vehicleType || '',
      capacityInTon: selectedTruck?.capacityInTon || '',
      capacityInCubicMeters: selectedTruck?.capacityInCubicMeters || '',
      pollutionCertificateValidTill: selectedTruck?.pollutionCertificateValidTill?.split('T')[0] || '',
      insuranceValidTill: selectedTruck?.insuranceValidTill?.split('T')[0] || '',
      // Ensure assignedDriverId is the actual _id string from the driver object
      assignedDriverId: typeof selectedTruck?.assignedDriverId === 'object'
        ? selectedTruck.assignedDriverId._id
        : selectedTruck?.assignedDriverId || ''
    });

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const updateData = {
        ...formData,
        capacityInTon: parseFloat(formData.capacityInTon),
        capacityInCubicMeters: parseFloat(formData.capacityInCubicMeters),
        assignedDriverId: formData.assignedDriverId // Send selected driver ID (should be ObjectId string)
      };

      updateTruckDetails(selectedTruck._id, updateData);
    };

    return (
      <div className="absolute top-0 left-0 w-full min-h-full bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 z-50 py-28">
        <div className="mx-auto bg-white rounded-lg p-6 w-full max-w-2xl transform scale-95 opacity-100 transition-all duration-200 ease-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800 flex items-center space-x-2">
              <Edit className="w-6 h-6" />
              <span>Edit Truck</span>
            </h2>
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Registration Number *"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Brand *"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Model *"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={formData.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Vehicle Type *</option>
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Capacity in Tons *"
                value={formData.capacityInTon}
                onChange={(e) => handleInputChange('capacityInTon', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.1"
                step="0.1"
                required
              />
              <input
                type="number"
                placeholder="Capacity in Cubic Meters *"
                value={formData.capacityInCubicMeters}
                onChange={(e) => handleInputChange('capacityInCubicMeters', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.1"
                step="0.1"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pollution Certificate Valid Till *
                </label>
                <input
                  type="date"
                  value={formData.pollutionCertificateValidTill}
                  onChange={(e) => handleInputChange('pollutionCertificateValidTill', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Valid Till
                </label>
                <input
                  type="date"
                  value={formData.insuranceValidTill}
                  onChange={(e) => handleInputChange('insuranceValidTill', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Driver Selection Dropdown for Editing - CRITICAL CHANGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Driver *
                </label>
                <select
                  value={formData.assignedDriverId}
                  onChange={(e) => handleInputChange('assignedDriverId', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required // Make this required if assignedDriverId is required in the model
                >
                  <option value="">Select a Driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.fullName} ({driver.phone})
                    </option>
                  ))}
                </select>
                {drivers.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">No drivers available. Please add drivers first.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
                <span>{loading ? 'Updating...' : 'Update Truck'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Truck Details Modal Component
  const TruckDetailsModal = () => {
    const handleUpload = async () => {
      if (!documentsToUpload.rcBook && !documentsToUpload.insurance && !documentsToUpload.pollutionCertificate) {
        setError('Please select at least one document to upload');
        return;
      }

      const formData = new FormData();
      if (documentsToUpload.rcBook) {
        formData.append('rcBook', documentsToUpload.rcBook);
      }
      if (documentsToUpload.insurance) {
        formData.append('insurance', documents.insurance); // Fixed typo from documentsToUpload.insurance to documents.insurance
      }
      if (documentsToUpload.pollutionCertificate) {
        formData.append('pollutionCertificate', documentsToUpload.pollutionCertificate);
      }

      const success = await uploadTruckDocuments(selectedTruck._id, formData);
      if (success) {
        setShowDocumentModal(false);
        setDocumentsToUpload({
          rcBook: null,
          insurance: null,
          pollutionCertificate: null,
        });
      }
    };

    return (
        selectedTruck && (
            <div className="absolute top-0 left-0 w-full min-h-full bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 z-[1000] py-8">
                <div className="mx-auto bg-white rounded-lg p-6 w-full max-w-4xl transform scale-95 opacity-100 transition-all duration-200 ease-out">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-blue-800">Truck Details</h2>
                        <button
                            onClick={() => setSelectedTruck(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Registration:</span>
                                    <span className="font-semibold">{selectedTruck.registrationNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Brand:</span>
                                    <span className="font-semibold">{selectedTruck.brand}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Model:</span>
                                    <span className="font-semibold">{selectedTruck.model}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-semibold capitalize">{selectedTruck.vehicleType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Capacity:</span>
                                    <span className="font-semibold">{selectedTruck.capacityInTon}T / {selectedTruck.capacityInCubicMeters}m³</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTruck.status)}`}>
                                        {selectedTruck.status ? selectedTruck.status.toUpperCase() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold">
                                        {selectedTruck.assignedDriverId ? getDriverNameOrId(selectedTruck.assignedDriverId) : 'Not Assigned'}
                                    </span>
                                </div>
                                {selectedTruck.assignedDriverId && typeof selectedTruck.assignedDriverId === 'object' && (
                                    <>
                                        {/* Display full details if assignedDriverId is populated */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-600">Phone:</span>
                                            <span>{selectedTruck.assignedDriverId.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-600">Driver ID:</span>
                                            <span className="text-sm text-gray-500">
                                                {selectedTruck.assignedDriverId._id}
                                            </span>
                                        </div>
                                    </>
                                )}
                                {selectedTruck.assignedDriverId && typeof selectedTruck.assignedDriverId === 'string' && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Assigned Driver ID:</span>
                                        <span className="text-sm text-gray-500">
                                            {selectedTruck.assignedDriverId}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                <FileText className="w-5 h-5" />
                                <span>Document Status</span>
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">RC Book:</span>
                                    {selectedTruck.documents?.rcBook ? (<CheckCircle className="w-5 h-5 text-green-600" />) : (<XCircle className="w-5 h-5 text-red-600" />)}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Insurance:</span>
                                    <div className="flex items-center space-x-2">
                                        {selectedTruck.documents?.insurance ? (<CheckCircle className="w-5 h-5 text-green-600" />) : (<XCircle className="w-5 h-5 text-red-600" />)}
                                        {selectedTruck.insuranceValidTill && isDocumentExpiring(selectedTruck.insuranceValidTill) && (<AlertTriangle className="w-5 h-5 text-yellow-600" title="Expiring Soon" />)}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Pollution Certificate:</span>
                                    <div className="flex items-center space-x-2">
                                        {selectedTruck.documents?.pollutionCertificate ? (<CheckCircle className="w-5 h-5 text-green-600" />) : (<XCircle className="w-5 h-5 text-red-600" />)}
                                        {isDocumentExpiring(selectedTruck.pollutionCertificateValidTill) && (<AlertTriangle className="w-5 h-5 text-yellow-600" title="Expiring Soon" />)}
                                    </div>
                                </div>
                                {selectedTruck.insuranceValidTill && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Insurance Valid Till:</span>
                                        <span className="font-medium">{new Date(selectedTruck.insuranceValidTill).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">PUC Valid Till:</span>
                                    <span className="font-medium">{new Date(selectedTruck.pollutionCertificateValidTill).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDocumentModal(true)}
                                className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Update Documents</span>
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                <Calendar className="w-5 h-5" />
                                <span>Actions</span>
                            </h3>
                            <div className="space-y-3">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => activateDeactivateTruck(selectedTruck._id, selectedTruck.status)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg flex-1 justify-center ${selectedTruck.status === 'active' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                        disabled={loading}
                                    >
                                        {loading ? (<RefreshCw className="w-4 h-4 animate-spin" />) : selectedTruck.status === 'active' ? (<PowerOff className="w-4 h-4" />) : (<Power className="w-4 h-4" />)}
                                        <span>{selectedTruck.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                                    </button>
                                    <button
                                        onClick={() => { setSelectedTruck(selectedTruck); setShowEditModal(true); }}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1 justify-center"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                </div>
                                <button
                                    onClick={() => deleteTruck(selectedTruck._id)}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    disabled={loading}
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    <span>{loading ? 'Deleting...' : 'Delete Truck'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 p-4 md:p-8 lg:p-28">
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 flex items-center space-x-2">
                            <Truck className="w-8 h-8" />
                            <span>My Trucks</span>
                        </h1>
                        <p className="text-gray-600 mt-1">Manage your fleet efficiently</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowAddTruckModal(true)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Truck</span>
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={() => setError('')}
                            className="text-red-700 hover:text-red-900"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by registration, brand, model, or driver..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <select
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterVehicleType}
                            onChange={(e) => setFilterVehicleType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            {vehicleTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-600 text-sm">Total Trucks</p>
                    <p className="text-2xl font-bold text-blue-800">{trucks.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-600 text-sm">Active Trucks</p>
                    <p className="text-2xl font-bold text-green-600">{trucks.filter(t => t.status === 'active').length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-600 text-sm">Inactive Trucks</p>
                    <p className="text-2xl font-bold text-red-600">{trucks.filter(t => t.status === 'inactive').length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-600 text-sm">Expiring Docs</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {trucks.filter(t => isDocumentExpiring(t.insuranceValidTill) || isDocumentExpiring(t.pollutionCertificateValidTill)).length}
                    </p>
                </div>
            </div>

            {loading && trucks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading trucks...</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTrucks.map((truck) => (
                        <div key={truck._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{truck.registrationNumber}</h3>
                                            <p className="text-sm text-gray-600">{truck.brand} {truck.model}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(truck.status)}`}>
                                        {truck.status ? truck.status.toUpperCase() : 'N/A'}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Driver:</span>
                                        <span className="font-medium">{getDriverNameOrId(truck.assignedDriverId)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">PUC Valid Till:</span>
                                        <span className="font-medium text-xs">{new Date(truck.pollutionCertificateValidTill).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => setSelectedTruck(truck)} className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm flex-1">
                                        <Eye className="w-4 h-4" />
                                        <span>View</span>
                                    </button>
                                    <button onClick={() => { setSelectedTruck(truck); setShowEditModal(true); }} className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteTruck(truck._id)} className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm" disabled={loading}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredTrucks.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No trucks found</h3>
                    <p className="text-gray-600 mb-6">
                        {trucks.length === 0 ? "Add your first truck to get started." : "Try adjusting your search or filter criteria."}
                    </p>
                    <button onClick={() => setShowAddTruckModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Add New Truck
                    </button>
                </div>
            )}
        </div>

        {showAddTruckModal && <AddTruckModal />}
        {showEditModal && selectedTruck && <EditTruckModal />}
        {selectedTruck && !showEditModal && !showDocumentModal && <TruckDetailsModal />}
        {showDocumentModal && selectedTruck && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Update Documents for {selectedTruck.registrationNumber}</h2>
                        <button onClick={() => setShowDocumentModal(false)}><XCircle /></button>
                    </div>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">RC Book</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setDocumentsToUpload(prev => ({...prev, rcBook: e.target.files[0]}))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setDocumentsToUpload(prev => ({...prev, insurance: e.target.files[0]}))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pollution Certificate</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setDocumentsToUpload(prev => ({...prev, pollutionCertificate: e.target.files[0]}))}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => setShowDocumentModal(false)}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span>{loading ? 'Uploading...' : 'Upload'}</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ViewTrucks;