import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Mail, Clock } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import EventList from '../../components/events/EventList';
import Spinner from '../../components/ui/Spinner';

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCustomer, customerEvents, fetchCustomerById, fetchCustomerEvents } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const customer = await fetchCustomerById(id);
      
      if (customer) {
        await fetchCustomerEvents(id);
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [id, fetchCustomerById, fetchCustomerEvents]);
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!currentCustomer) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Customer not found</h2>
        <p className="mt-2 text-gray-600">
          The customer you're looking for doesn't exist.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/admin/customers')}
          className="mt-4"
        >
          Back to Customers
        </Button>
      </div>
    );
  }
  
  // Count events by status
  const pendingEvents = customerEvents.filter(event => event.status === 'pending').length;
  const approvedEvents = customerEvents.filter(event => event.status === 'approved').length;
  const rejectedEvents = customerEvents.filter(event => event.status === 'rejected').length;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link to="/admin/customers">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-12 w-12" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentCustomer.full_name || 'No Name'}
                </h3>
                <div className="mt-1 flex items-center justify-center text-sm text-gray-500">
                  <Mail className="mr-1 h-4 w-4" />
                  {currentCustomer.email}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-500">Role</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {currentCustomer.role}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-500">Joined</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(currentCustomer.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Total Events</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{customerEvents.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{pendingEvents}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Approved</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{approvedEvents}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="mr-2 h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">Rejected</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{rejectedEvents}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Events</CardTitle>
            </CardHeader>
            
            <CardContent>
              <EventList
                events={customerEvents}
                showStatus={true}
                emptyStateTitle="No events created"
                emptyStateDescription="This customer hasn't created any events yet."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}