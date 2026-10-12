import React from 'react';
import { IndicatorStatus, ActionPlanStatus, VisitStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'teal' | 'amber' | 'green' | 'red' | 'blue' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon
}) => {
  const variantStyles = {
    default: 'bg-teal-50 text-teal-800 border-teal-200',
    teal: 'bg-[#E6F2EF] text-[#176B5B] border-[#AFDCD1]',
    amber: 'bg-[#FEF7E6] text-[#B45309] border-[#FDE68A]',
    green: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
    red: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    gray: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const IndicatorBadge: React.FC<{ status: IndicatorStatus }> = ({ status }) => {
  switch (status) {
    case 'Observed':
      return <Badge variant="green" size="sm">✓ Observed</Badge>;
    case 'Partly Observed':
      return <Badge variant="amber" size="sm">◐ Partly Observed</Badge>;
    case 'Needs Support':
      return <Badge variant="red" size="sm">! Needs Support</Badge>;
    default:
      return <Badge variant="gray" size="sm">{status}</Badge>;
  }
};

export const ActionStatusBadge: React.FC<{ status: ActionPlanStatus }> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return <Badge variant="green">Completed</Badge>;
    case 'In Progress':
      return <Badge variant="blue">In Progress</Badge>;
    case 'Needs Further Support':
      return <Badge variant="amber">Needs Further Support</Badge>;
    case 'Not Started':
    default:
      return <Badge variant="gray">Not Started</Badge>;
  }
};

export const VisitStatusBadge: React.FC<{ status: VisitStatus }> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return <Badge variant="green">Completed</Badge>;
    case 'In Progress':
      return <Badge variant="amber">In Progress</Badge>;
    case 'Scheduled':
      return <Badge variant="teal">Scheduled</Badge>;
    case 'Cancelled':
      return <Badge variant="gray">Cancelled</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
};
