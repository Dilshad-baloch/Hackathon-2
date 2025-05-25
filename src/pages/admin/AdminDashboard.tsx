import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Users, 
  AlertTriangle,
  BarChart 
} from 'lucide-react';
import { useEventStore } from '../../stores/eventStore';
import { useUserStore } from '../../stores/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function AdminDashboard() {
  const { events, pendingEvents, fetchEvents, fetchPendingEvents } = useEventStore();
  const { customers, fetchCustomers } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchEvents(),
        fetchPendingEvents(),
        fetchCustomers(),
      ]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchEvents, fetchPendingEvents, fetchCustomers]);
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const approvedEvents = events.filter(event => event.status === 'approved');
  const rejectedEvents = events.filter(event => event.status === 'rejected');
  
  // Calculate category distribution
  const categories = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Manage events, users, and system settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-center text-xl">
              {events.length}
            </CardTitle>
            <p className="text-center text-sm text-gray-500">Total Events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-center text-xl">
              {pendingEvents.length}
            </CardTitle>
            <p className="text-center text-sm text-gray-500">Pending Approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-center text-xl">
              {approvedEvents.length}
            </CardTitle>
            <p className="text-center text-sm text-gray-500">Approved Events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-center text-xl">
              {customers.length}
            </CardTitle>
            <p className="text-center text-sm text-gray-500">Customers</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Pending Events
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {pendingEvents.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No pending events</p>
            ) : (
              <div className="space-y-4">
                {pendingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
                
                {pendingEvents.length > 5 && (
                  <div className="text-center pt-2">
                    <Link to="/admin/pending-events">
                      <Button variant="outline" size="sm">
                        View All Pending Events
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-blue-500" />
              Top Categories
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {topCategories.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No categories data</p>
            ) : (
              <div className="space-y-4">
                {topCategories.map(([category, count]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm text-gray-500">{count} events</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${(count / events.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          
          <CardContent>
            {customers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No customers yet</p>
            ) : (
              <div className="space-y-4">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {customer.full_name || customer.email}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(customer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/admin/customers/${customer.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
                
                {customers.length > 5 && (
                  <div className="text-center pt-2">
                    <Link to="/admin/customers">
                      <Button variant="outline" size="sm">
                        View All Customers
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link to="/admin/pending-events">
                <Button variant="outline" fullWidth className="justify-start">
                  <Clock className="mr-2 h-5 w-5" />
                  Pending Events
                </Button>
              </Link>
              
              <Link to="/admin/all-events">
                <Button variant="outline" fullWidth className="justify-start">
                  <Calendar className="mr-2 h-5 w-5" />
                  All Events
                </Button>
              </Link>
              
              <Link to="/admin/customers">
                <Button variant="outline" fullWidth className="justify-start">
                  <Users className="mr-2 h-5 w-5" />
                  Customers
                </Button>
              </Link>
              
              <Link to="/events/create">
                <Button variant="primary" fullWidth className="justify-start">
                  <Calendar className="mr-2 h-5 w-5" />
                  Create Event
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}