import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import type { IMetricCardData } from '../MetricCardsSection';
import type { IDemandAndDev } from '@/interfaces/DemandAndDev';
import { mapValueToPercentageString } from './tools';


interface DemandCardConfig {
  key: keyof IDemandAndDev;
  icon: React.ReactNode;
  title: string;
  subtitle?:string;
}

const DemandAndDevCardsConfig: DemandCardConfig[] = [
    {key:"rentersRatio", icon: <PeopleAltOutlinedIcon fontSize='large'/>, title:"Renters Ratio"},
    {key:"demandSupplyRatio", icon: <DomainOutlinedIcon fontSize='large'/>, title:"Demand Supply Ratio"},
    {key:"buildingApprovals12M", icon: <HandymanOutlinedIcon fontSize='large'/>, title:"Building Approvals", subtitle:"(12 months)"},
    {key:"devProjectsCount", icon: <DomainOutlinedIcon fontSize='large'/>, title:"Development Projects", subtitle:"(current)"},
]

export function mapDevCardData(apiData: IDemandAndDev): IMetricCardData[] {
    return DemandAndDevCardsConfig.map(cfg => {
        const value = apiData[cfg.key];
        if (cfg.key === "rentersRatio" || cfg.key === "demandSupplyRatio") {
            return {
                icon: cfg.icon,
                title: cfg.title,
                value: mapValueToPercentageString(value),
            }
        } 
        return {
            icon: cfg.icon,
            title: cfg.title,
            value: value.toLocaleString(),
            subtitle: cfg.subtitle
        };        
    });
}
