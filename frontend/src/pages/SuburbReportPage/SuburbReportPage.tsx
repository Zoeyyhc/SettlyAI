import ActionButtonWrapper from '@/pages/SuburbReportPage/components/ActionButtonGroup/ActionButtonWrapper';
import BannerWrapper from '@/pages/SuburbReportPage/components/Banner/BannerWrapper';
import { Box, Button, styled, Typography } from '@mui/material';
import MetricCardsSection from './components/MetricCardsSection';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { getDemandAndDev } from '@/api/suburbApi';
import {mapDevCardData} from '@/pages/SuburbReportPage/components/MetricCardsSection/utils/MakeCards'
import type { IMetricCardData } from './components/MetricCardsSection/MetricCardsSection';
import { useEffect, useState } from 'react';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  padding: theme.spacing(8),
}));

const ContextContainer = styled(Box)(({ theme }) => ({
  maxWidth: '936px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(8),
  width: '100%',
  paddingTop: theme.spacing(8),
}));

const SuburbReportPage = () => {
   
  const TITLES = {
    incomeEmployment: 'Income & Employment',
    propertyMarketInsights: 'Property Market Insghts',
    demandDevelopment: 'Demand & Development',
    lifeStyle: 'LifeStyle & Accessibility',
    safetyScore: 'Safety & Score',
  };
  const [demandAndDevCards, setDemandAndDevCards] = useState<IMetricCardData[]>([]);
  // loading and errorMessage for page loading status
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const metricCardsData = [
    {
      icon: <AccountBalanceIcon />,
      title: 'Financial Health',
      value: '$12,500',
      subtitle: 'Total Savings',
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Monthly Income',
      value: '$3,200',
      subtitle: 'After Tax',
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Credit Score',
      value: '752',
      subtitle: 'Excellent',
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Loan Balance',
      value: '$8,900',
      subtitle: 'Remaining',
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Investments',
      value: '$15,000',
      subtitle: 'Stocks & Funds',
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Monthly Expenses',
      value: '$2,100',
      subtitle: 'Utilities & Rent',
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Net Worth',
      value: '$28,400',
      subtitle: 'Assets - Liabilities',
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Retirement Fund',
      value: '$7,800',
      subtitle: 'Superannuation',
    },
  ];

  // use useEffect for APi fetching test, this part will be replaced by useQueries later 
  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);
    const suburbId = localStorage.getItem('suburbId');
    if (suburbId) {
      const fetchDemandAndDevData = async() => {
        try {
          const data = await getDemandAndDev(parseInt(suburbId));
          setDemandAndDevCards(mapDevCardData(data));
        } catch (error) {
          if (error instanceof Error) setErrorMessage(error.message);
          else setErrorMessage(String(error));
        } finally {
          setLoading(false);
        }
      }
      fetchDemandAndDevData();
    } else {
      setErrorMessage("Cannot find the surbub Id")
      setLoading(false);
    }
  }, []);
  // 1. Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // 2. Error state
  if (errorMessage) {
    return <p style={{ color: "red" }}>Error: {errorMessage}</p>;
  }

  return (
    <PageContainer>
      {/* todo: replace with real banner content */}
      <BannerWrapper>
        <Typography variant="h3" fontWeight={700}>
          Welcome to xxx
        </Typography>
      </BannerWrapper>
      {/* todo: replace with real card content */}
      <ContextContainer>
        <MetricCardsSection
            title={TITLES.demandDevelopment}
            data={demandAndDevCards}
        />        
        <MetricCardsSection
          title="Lifestyle Accessibility"
          data={metricCardsData}
        />
        {/* todo:  replace with real action buttons , feel free to modify*/}
        <ActionButtonWrapper>
          <Button>save this suburb</Button>
          <Button>Export PDF</Button>
        </ActionButtonWrapper>
      </ContextContainer>
    </PageContainer>
  );
};

export default SuburbReportPage;
