import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { SignupCredentials } from '../types/auth';

const SignupPage: React.FC = () => {
  const { signup, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupCredentials>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <Card className="w-full max-w-md border border-indigo-100">
        <CardHeader className="space-y-3">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-center text-gray-600">Join our community today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(signup)} className="space-y-4">
            <div>
              <Input
                placeholder="Name"
                {...register('name', { required: 'Name is required' })}
                className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Username"
                {...register('username', { required: 'Username is required' })}
                className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register('email', { required: 'Email is required' })}
                className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
                className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
              Sign Up
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;