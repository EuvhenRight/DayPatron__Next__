import MainCard from 'components/MainCard';
import {
  Grid,
  Typography
} from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import {
  CheckCircleOutlined
} from '@ant-design/icons';

const FastTrackPage = () => {

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  SET CLEAR OUTCOMES
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  It sounds like an obvious one, but set clear expectations and goals for the 10x-er. Be as specific as you can be about the desired outcome. The more explicit you can make it, the faster your 10x-er will deliver (see ‘Create Comprehensive Briefing’).
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  CREATE COMPREHENSIVE BRIEFING
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Do you have a comprehensive briefing with mission details and background information? Is this briefing shared internally as well with relevant stakeholders?
                  <ul className='left-list'>
                    <li>Objectives</li>
                    <li>Budgets</li>
                    <li>Target audiences</li>
                    <li>Time frame</li>
                    <li>Relevant milestones and;</li>
                    <li>Deadlines</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  COMPILE ONBOARDING PACKAGE
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Prepare an onboarding package with reading material. Think of:
                  <ul className='left-list'>
                    <li>Due diligence reports</li>
                    <li>Strategy documentation</li>
                    <li>Organizational chart</li>
                    <li>Roadmap</li>
                    <li>Key procedures & policies</li>
                    <li>Code of Conduct</li>
                    <li>Key rituals of company (e.g. get together, team lunches)</li>
                    <li>Explain company culture</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  GRANT ACCESS TO SYSTEMS & REPORTS
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Grant access to required systems, tools and platforms. Does the 10x-er need to see dashboards, reports, or any other information? Do you have sufficient licenses for these applications? Think of:
                  <ul className='left-list'>
                    <li>Knowledge base</li>
                    <li>Document sharing</li>
                    <li>HRIS & ATS</li>
                    <li>CRM</li>
                    <li>Accounting</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  ARRANGE SIGNING AUTHORIZATIONS
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Is your 10x-er going to sign documents on your behalf? Do you need a signing mandate for your 10x-er? Think of:
                  <ul className='left-list'>
                    <li>Internally</li>
                    <li>Your bank</li>
                    <li>Accountant</li>
                    <li>Laywers</li>
                    <li>Chamber of Commerce</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  MAP COMMUNICATION CHANNELS
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Are there any messaging applications being used within your company? Think of:
                  <ul className='left-list'>
                    <li>Microsoft Teams</li>
                    <li>Slack channels</li>
                    <li>Skype</li>
                    <li>Telegram</li>
                    <li>Discord server</li>
                    <li>WhatsApp groups</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  SHARE TEMPLATES & STYLE GUIDE
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Ask any CEO and CMO…we’d love for all documents to be consistent in terms of lay-out and structure. Think of sharing your:
                  <ul className='left-list'>
                    <li>Templates (Word, Excel, PowerPoint)</li>
                    <li>Style guide</li>
                    <li>Brand guidelines</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  FORWARD RECURRING MEETINGS
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Are there any recurring meetings the 10x-er needs to be in? Already forward the meetings to the mailbox of the 10x-er before start. We suggest to also map these meetings with the agreed availability of the 10x-er.
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  SHARE CONTACT DETAILS
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Think of sharing the following information internally and with relevant external stakeholders:
                  <ul className='left-list'>
                    <li>Full name</li>
                    <li>Phone number</li>
                    <li>Email address</li>
                    <li>WhatsApp availability y/n</li>
                    <li>Telegram handle</li>
                    <li>Discord server handle</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  CREATE A CONTACT LIST
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Create a list with internal and external contacts and include their email address but also phone number. Don’t forget to include suppliers that might be relevant. Make sure to inform all parties that you are sharing their details and to whom.
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  ASSIGN DEDICATED POINT OF CONTACT
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Make it explicit to the 10x-er but also internally within your organization who the go-to-person is for your 10x-er.
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  EQUIP YOUR 10X-ER
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Do you want the 10x-er to use your hardware (computers & telephone)? Discuss in advance what works best for you.
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
        <Grid item xs={4}>
          <MainCard sx={{height: '100%'}}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>
                  <CheckCircleOutlined />
                </Avatar>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography align="left" variant="h5" className='vcenter-title'>
                  CONDUCT DAY 1 ONBOARDING SESSION
                </Typography>
                <Typography align="left" variant="body1" color="secondary">
                  Make a list of all internal stakeholders and already schedule the meetings, preferably on Day 1.
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

      </Grid>
    </>
  );
};

export default FastTrackPage;