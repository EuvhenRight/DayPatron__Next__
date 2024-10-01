import { format } from 'date-fns';
import { useOutletContext  } from 'react-router-dom';
import {
  Grid,
  Typography,
  Chip,
  Stack,
  Box
} from '@mui/material';

import MainCard from 'components/MainCard';
import SanitizedHTML from 'react-sanitized-html';

import { ShopOutlined, FileDoneOutlined } from '@ant-design/icons';
import languages from 'data/languages';
import jobRoles from 'data/jobRoles';
import industries from 'data/industries';
import jobClusters from 'data/jobClusters';

const ContractorExperience = () => {
    const [missionContractorMatch] = useOutletContext();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <MainCard>
                            
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <Stack spacing={0.3}>
                                <Typography variant="h4">Roles</Typography>
                                <Box>
                                    {missionContractorMatch?.contractor?.expertise?.jobRoles?.length > 0 ? 
                                        missionContractorMatch?.contractor?.expertise?.jobRoles?.map((jobRole, jobRoleIndex) => {
                                        return (                            
                                            <Chip sx={{float: 'left', marginTop: '5px', marginRight: '5px'}} key={jobRoleIndex} color="success" variant="outlined" size="small" label={jobRoles.find(x => x.code === jobRole)?.label} />);
                                        }) :
                                        (<Typography>No data.</Typography>)
                                    }
                                </Box>
                            </Stack>
                            
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={0.3}>
                                <Typography variant="h4">Clusters</Typography>
                                <Box>
                                    {missionContractorMatch?.contractor?.expertise?.jobClusters?.length > 0 ? 
                                        missionContractorMatch?.contractor?.expertise?.jobClusters?.map((jobCluster, jobClusterIndex) => {
                                        return (                            
                                            <Chip sx={{float: 'left', marginTop: '5px', marginRight: '5px'}} key={jobClusterIndex} color="success" variant="outlined" size="small" label={jobClusters.find(x => x.code === jobCluster)?.label} />);
                                        }) :
                                        (<Typography>No data.</Typography>)
                                    }
                                </Box>
                            </Stack>
                            
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={0.3}>
                                <Typography variant="h4">Industries</Typography>
                                <Box>
                                    {missionContractorMatch?.contractor?.expertise?.industries?.length > 0 ? 
                                        missionContractorMatch?.contractor?.expertise?.industries?.map((industry, industryIndex) => {
                                        return (                            
                                            <Chip sx={{float: 'left', marginTop: '5px', marginRight: '5px'}} key={industryIndex} color="success" variant="outlined" size="small" label={industries.find(x => x.code === industry)?.label} />);
                                        }) :
                                        (<Typography>No data.</Typography>)
                                    }
                                </Box>
                            </Stack>
                            
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={0.3}>
                                <Typography variant="h4">Languages</Typography>
                                <Box>
                                    {missionContractorMatch?.contractor?.expertise?.languages?.length > 0 ? 
                                        missionContractorMatch?.contractor?.expertise?.languages?.map((language, languageIndex) => {
                                        return (                            
                                            <Chip sx={{float: 'left', marginTop: '5px', marginRight: '5px'}} key={languageIndex} color="success" variant="outlined" size="small" label={languages.find(x => x.code === language)?.label} />);
                                        }) :
                                        (<Typography>No data.</Typography>)
                                    }
                                </Box>
                            </Stack>
                            
                        </Grid>
                    </Grid>

                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Work</Typography>
                        </Grid>
                        {missionContractorMatch?.contractor?.professionalExperiences?.length > 0 ?
                            missionContractorMatch?.contractor?.professionalExperiences?.map((professionalExperience, professionalExperienceIndex) => {
                            return (<Grid key={professionalExperienceIndex} item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        {professionalExperience?.companyLogoUrl ? 
                                        (
                                        <img
                                            style={{ width: 50, height: 50, textDecoration: 'none', opacity: 1 }}
                                            alt={professionalExperience?.company}
                                            src={professionalExperience?.companyLogoUrl}
                                        />
                                        ) : 
                                        (
                                        <ShopOutlined style={{ fontSize: '3rem' }}  />
                                        )}
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography align="left" variant="h5">
                                            {professionalExperience?.title}
                                        </Typography>
                                        <Typography variant="h6">
                                            {professionalExperience?.company}
                                        </Typography>
                                        <Typography color="secondary">
                                            {professionalExperience?.location}
                                        </Typography>
                                        <Typography color="secondary">
                                            {format(new Date(professionalExperience?.startDateUtc), 'MMM y')}&nbsp;-&nbsp;{professionalExperience?.endDateUtc ? format(new Date(professionalExperience?.endDateUtc), 'MMM y') : 'Present'}
                                        </Typography>
                                        <SanitizedHTML html={professionalExperience?.description} />
                                    </Grid>
                                </Grid>
                            </Grid>);
                            }) :
                            (<Grid item xs={12}>
                                <Typography>No data.</Typography>
                            </Grid>)
                        }
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Education</Typography>
                        </Grid>
                        {missionContractorMatch?.contractor?.educations?.length > 0 ?
                            missionContractorMatch?.contractor?.educations?.map((education, educationIndex) => {
                            return (<Grid key={educationIndex} item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        {education?.schoolLogoUrl ? 
                                        (
                                        <img
                                            style={{ width: 50, height: 50, textDecoration: 'none', opacity: 1 }}
                                            alt={education?.school}
                                            src={education?.schoolLogoUrl}
                                        />
                                        ) : 
                                        (
                                        <ShopOutlined style={{ fontSize: '3rem' }}  />
                                        )}
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography align="left" variant="h5">
                                            {education?.degreeName}
                                        </Typography>
                                        <Typography variant="h6">
                                            {education?.school}
                                        </Typography>
                                        <Typography color="secondary">
                                            {education?.fieldOfStudy}
                                        </Typography>
                                        <Typography color="secondary">
                                            {format(new Date(education?.startDateUtc), 'MMM y')}&nbsp;-&nbsp;{education?.endDateUtc ? format(new Date(education?.endDateUtc), 'MMM y') : 'Present'}
                                        </Typography>
                                        <SanitizedHTML html={education?.description} />
                                    </Grid>
                                </Grid>
                            </Grid>);
                            }) :
                            (<Grid item xs={12}>
                                <Typography>No data.</Typography>
                            </Grid>)
                        }
                    </Grid>

                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard>
                            
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Certification</Typography>
                        </Grid>
                        {missionContractorMatch?.contractor?.certifications?.length > 0 ? 
                            missionContractorMatch?.contractor?.certifications?.map((certification, certificationIndex) => {
                            return (<Grid key={certificationIndex} item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <FileDoneOutlined style={{ fontSize: '3rem' }}  />
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography align="left" variant="h5">
                                            {certification?.name}
                                        </Typography>
                                        <Typography variant="h6">
                                            {certification?.authority}
                                        </Typography>
                                        <Typography color="secondary">
                                            {format(new Date(certification?.startDateUtc), 'MMM y')}&nbsp;-&nbsp;{certification?.endDateUtc ? format(new Date(certification?.endDateUtc), 'MMM y') : 'Present'}
                                        </Typography>
                                        <Typography color="secondary">
                                            {certification?.url}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>);
                            }) :
                            (<Grid item xs={12}>
                                <Typography>No data.</Typography>
                            </Grid>)
                        }
                    </Grid>

                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard>
                            
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Recommendations</Typography>
                        </Grid>
                        {missionContractorMatch?.contractor?.recommendations?.length > 0 ? 
                            missionContractorMatch?.contractor?.recommendations?.map((recommendation, recommendationIndex) => {
                            return (<Grid key={recommendationIndex} item xs={12}>
                                <Stack>
                                    <Typography sx={{ fontWeight: 'bold' }}>{recommendation?.authorName}</Typography>
                                    <Typography sx={{ fontStyle: 'italic' }}>&quot;{recommendation?.description}&quot;</Typography>
                                </Stack>
                                
                            </Grid>);
                            }) :
                            (<Grid item xs={12}>
                                <Typography>No data.</Typography>
                            </Grid>)
                        }
                    </Grid>

                </MainCard>
            </Grid>
        </Grid>
    );
};

export default ContractorExperience;