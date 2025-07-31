'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter, ModalClose } from '@/components/ui/Modal';
import { Toast, ToastProvider, useToast } from '@/components/ui/Toast';
import { VehicleCard } from '@/components/examples/VehicleCard';
import { formatPrice } from '@/lib/utils';

export default function ComponentExamplesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    country: 'us',
  });
  const [showIndividualToast, setShowIndividualToast] = useState(false);

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Sample vehicle data
  const sampleVehicles = [
    {
      id: 'v1',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 28500,
      mileage: 12500,
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      exteriorColor: 'Silver',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    },
    {
      id: 'v2',
      make: 'Honda',
      model: 'Accord',
      year: 2021,
      price: 26900,
      mileage: 18700,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZGElMjBhY2NvcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      exteriorColor: 'Blue',
      transmission: 'Automatic',
      fuelType: 'Hybrid',
    },
    {
      id: 'v3',
      make: 'Ford',
      model: 'Mustang',
      year: 2023,
      price: 45000,
      mileage: 5200,
      imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d661c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZCUyMG11c3Rhbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      exteriorColor: 'Red',
      transmission: 'Manual',
      fuelType: 'Gasoline',
    }
  ];

  // Toast example component
  const ToastExamples = () => {
    const { showToast } = useToast();
    
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => showToast({
            title: 'Success',
            description: 'Your changes have been saved successfully.',
            variant: 'success',
          })}
        >
          Success Toast
        </Button>
        <Button 
          variant="outline"
          onClick={() => showToast({
            title: 'Information',
            description: 'Your session will expire in 5 minutes.',
            variant: 'info',
          })}
        >
          Info Toast
        </Button>
        <Button 
          variant="destructive"
          onClick={() => showToast({
            title: 'Error',
            description: 'There was a problem with your request.',
            variant: 'error',
          })}
        >
          Error Toast
        </Button>
        <Button 
          variant="secondary"
          onClick={() => showToast({
            title: 'Warning',
            description: 'This action cannot be undone.',
            variant: 'warning',
          })}
        >
          Warning Toast
        </Button>
        <Button 
          variant="ghost"
          onClick={() => showToast({
            title: 'New Message',
            description: 'You have a new message from the dealer.',
            action: (
              <button 
                className="rounded bg-primary-500 px-2 py-1 text-xs text-white hover:bg-primary-600"
                onClick={() => console.log('Action clicked')}
              >
                View
              </button>
            )
          })}
        >
          Toast with Action
        </Button>
      </div>
    );
  };

  return (
    <ToastProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Cars.na UI Component Examples</h1>
        
        {/* Individual Toast Example */}
        {showIndividualToast && (
          <Toast
            title="Welcome!"
            description="This is an example of an individual toast component."
            variant="info"
            onClose={() => setShowIndividualToast(false)}
          />
        )}
        
        {/* Section: Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width Button</Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Section: Form Controls */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Form Controls</h2>
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Example</CardTitle>
              <CardDescription>Demonstrates various form elements working together</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your name"
                  value={formState.name}
                  onChange={handleInputChange}
                />
                
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  helperText="We'll never share your email with anyone else."
                  value={formState.email}
                  onChange={handleInputChange}
                />
                
                <Select
                  id="country"
                  name="country"
                  label="Country"
                  value={formState.country}
                  onChange={handleInputChange}
                  options={[
                    { value: 'us', label: 'United States' },
                    { value: 'ca', label: 'Canada' },
                    { value: 'mx', label: 'Mexico' },
                    { value: 'uk', label: 'United Kingdom' },
                  ]}
                />
                
                <Textarea
                  id="message"
                  name="message"
                  label="Message"
                  placeholder="What would you like to know about this vehicle?"
                  value={formState.message}
                  onChange={handleInputChange}
                />
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="text-sm text-neutral-700">
                    I agree to the Terms and Conditions
                  </label>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mr-2">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </section>
        
        {/* Section: Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>This is a simple card with header, content and footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the main content area of the card. You can put any content here.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm" className="ml-2">Save</Button>
              </CardFooter>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>This card has an elevated shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The elevated variant adds more shadow to make the card stand out.</p>
              </CardContent>
              <CardFooter align="end">
                <Button>Action</Button>
              </CardFooter>
            </Card>
            
            <Card variant="bordered" padding="none">
              <img 
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" 
                alt="Car" 
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>Image Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This card has no padding at the top level to allow for a full-width image.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Section: Modal */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Modal Dialog</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              </div>
              
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalHeader>
                  <ModalTitle>Example Modal</ModalTitle>
                  <ModalDescription>This is an example of the Modal component.</ModalDescription>
                </ModalHeader>
                <ModalContent>
                  <p>Modal content goes here. You can include any content, forms, or other components.</p>
                  <div className="mt-4">
                    <Input 
                      id="modal-input" 
                      label="Sample Input" 
                      placeholder="Type something..." 
                    />
                  </div>
                </ModalContent>
                <ModalFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                </ModalFooter>
                <ModalClose onClose={() => setIsModalOpen(false)} />
              </Modal>
            </CardContent>
          </Card>
        </section>
        
        {/* Section: Toast Notifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Toast Notifications</h2>
          <Card>
            <CardHeader>
              <CardTitle>Toast Examples</CardTitle>
              <CardDescription>Click the buttons below to trigger different toast notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={() => setShowIndividualToast(true)}>Show Individual Toast</Button>
              </div>
              
              <ToastExamples />
            </CardContent>
          </Card>
        </section>
        
        {/* Section: Vehicle Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Vehicle Listings Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                {...vehicle}
                onSaveClick={(id) => console.log(`Saved vehicle ${id}`)}
                onDetailsClick={(id) => console.log(`View details for ${id}`)}
              />
            ))}
          </div>
        </section>
        
        {/* Section: Data Display */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Data Display</h2>
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Comparison</CardTitle>
              <CardDescription>Example of data presentation in a table format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Vehicle</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Year</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Mileage</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Transmission</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {sampleVehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full object-cover" src={vehicle.imageUrl} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{vehicle.make} {vehicle.model}</div>
                              <div className="text-sm text-neutral-500">{vehicle.exteriorColor}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{vehicle.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{formatPrice(vehicle.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{vehicle.mileage.toLocaleString()} mi</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{vehicle.transmission}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button size="sm" variant="outline" className="mr-2">View</Button>
                          <Button size="sm">Compare</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ToastProvider>
  );
}
