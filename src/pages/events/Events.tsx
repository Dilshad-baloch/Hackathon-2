import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { useEventStore } from '../../stores/eventStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EventList from '../../components/events/EventList';
import Spinner from '../../components/ui/Spinner';

export default function Events() {
  const { events, fetchEvents, loading } = useEventStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  useEffect(() => {
    // Filter events based on search term and category
    const filtered = events.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === '' || event.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);
  
  const categoryOptions = [
    { value: 'Tech', label: 'Tech' },
    { value: 'Education', label: 'Education' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Business', label: 'Business' },
    { value: 'Health', label: 'Health' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Other', label: 'Other' },
  ];
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-gray-600">
            Browse and discover upcoming events
          </p>
        </div>
        <Link to="/events/create">
          <Button variant="primary" className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </Link>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center"
              disabled={!searchTerm && !selectedCategory}
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <EventList 
          events={filteredEvents}
          emptyStateTitle="No events found"
          emptyStateDescription={
            searchTerm || selectedCategory
              ? "No events match your search criteria. Try adjusting your filters."
              : "There are no events to display at the moment."
          }
        />
      )}
    </div>
  );
}