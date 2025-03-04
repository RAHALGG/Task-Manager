import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';
import { useRole } from './RoleContext';

const TeamContext = createContext(null);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const { setUserRole } = useRole();
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.teamId) {
      loadTeamData(user.teamId);
    }
  }, [user]);

  const loadTeamData = async (teamId) => {
    try {
      setLoading(true);
      const [teamResponse, membersResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.TEAMS.DETAILS(teamId)),
        axios.get(API_ENDPOINTS.TEAMS.MEMBERS(teamId))
      ]);

      setCurrentTeam(teamResponse.data);
      setTeamMembers(membersResponse.data);
      
      // تحديث دور المستخدم في الفريق
      const userMember = membersResponse.data.find(member => member.userId === user.id);
      if (userMember) {
        setUserRole(userMember.role);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async (email, role) => {
    try {
      const response = await axios.post(API_ENDPOINTS.TEAMS.INVITE(currentTeam.id), {
        email,
        role
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في دعوة العضو');
    }
  };

  const removeMember = async (memberId) => {
    try {
      await axios.delete(`${API_ENDPOINTS.TEAMS.MEMBERS(currentTeam.id)}/${memberId}`);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في إزالة العضو');
    }
  };

  const updateMemberRole = async (memberId, newRole) => {
    try {
      const response = await axios.patch(
        `${API_ENDPOINTS.TEAMS.MEMBERS(currentTeam.id)}/${memberId}`,
        { role: newRole }
      );
      setTeamMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'فشل في تحديث دور العضو');
    }
  };

  const value = {
    currentTeam,
    teamMembers,
    loading,
    error,
    inviteMember,
    removeMember,
    updateMemberRole,
    loadTeamData
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
}; 