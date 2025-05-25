import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useEventStore } from '../../stores/eventStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function PendingEvents() {
  const { pendingEvents, fetchPendingEvents, approveEvent, rejectEvent } = useEventStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchPendingEvents();
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchPendingEvents]);
  
  const handleApprove = async (id: string) => {
    try {
      const { error } = await approveEvent(id);
      
      if (error) {
        toast.error('Failed to approve event');
        return;
      }
      
      toast.success('Event approved successfully');
    } catch (error) {
      console.error('Error approving event:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      const { error } = await rejectEvent(id);
      
      if (error) {
        toast.error('Failed to reject event');
        return;
      }
      
      toast.success('Event rejected successfully');
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const filteredEvents = pendingEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Events</h1>
        <p className="mt-1 text-gray-600">
          Review and approve or reject event submissions
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search pending events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredEvents.length === 0 ? (
        <EmptyState
          type="events"
          title="No pending events"
          description="There are no events waiting for approval at the moment."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pending Events ({filteredEvents.length})</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={event.image_url || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={`/events/${event.id}`} className="hover:text-blue-600">
                                {event.title}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">{event.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {event.category}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(event.date_time).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(event.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(event.id)}
                            className="flex items-center"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(event.id)}
                            className="flex items-center"
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}