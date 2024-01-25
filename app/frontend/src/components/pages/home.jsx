import { useState, useEffect } from 'react';
import { Container, Paper, Tab, Tabs, Typography, Grid, Card, CardContent, Link, Box, Tooltip } from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReactMarkdown from 'react-markdown';
import fileStructureData from '../configs/fileStructure.json';
import summaryDetails from '../configs/summaryDetails.json';

const getColor = (language) => {
    switch (language) {
        case 'JavaScript': return 'gold';
        case 'Python': return 'deepskyblue';
        case 'HTML': return 'orangered';
        case 'CSS': return 'blueviolet';
        default: return 'grey';
    }
};

function LanguageBar({ languages }) {
    const total = Object.values(languages).reduce((sum, value) => sum + value, 0);

    return (
        <Box display="flex" width="100%" height={10} borderRadius={4} overflow="hidden">
            {Object.entries(languages).map(([lang, percent]) => (
                <Tooltip title={lang} key={lang}>
                    <Box width={`${(percent / total) * 100}%`} bgcolor={getColor(lang)} />
                </Tooltip>
            ))}
        </Box>
    );
}

function renderTree(nodes) {
    return (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );
}

function HomePage() {
    const [tabValue, setTabValue] = useState(0);
    const [readmeContent, setReadmeContent] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchReadme = async () => {
            const response = await fetch('README.md');
            const text = await response.text();
            setReadmeContent(text);
        };

        fetchReadme().catch(console.error);
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Repository Name
            </Typography>
    
            <Paper square>
                <Tabs
                    value={tabValue}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabChange}
                >
                    <Tab label="Summary" />
                    <Tab label="Readme" />
                    <Tab label="Additional Resources" />
                </Tabs>
            </Paper>
    
            {tabValue === 0 && (
                <Grid container spacing={2} style={{ marginTop: 20 }}>
                    <Grid item xs={12} md={8}>
                    <Card>
                    <CardContent>
    <Typography variant="h6" style={{ textDecoration: 'underline' }}>Project Summary</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.mainSummary}</Typography>

    <Typography variant="h6" style={{ textDecoration: 'underline', marginTop: '10px' }}>Overview</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Overview.Purpose}</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Overview.TechnologiesUsed}</Typography>

    <Typography variant="h6" style={{ textDecoration: 'underline', marginTop: '10px' }}>Backend</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Backend.MainComponents}</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Backend.EnvironmentVariables}</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Backend.DataProcessing}</Typography>

    <Typography variant="h6" style={{ textDecoration: 'underline', marginTop: '10px' }}>Frontend</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Frontend.Structure}</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Frontend.UserInterface}</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.Frontend.Styling}</Typography>

    <Typography variant="h6" style={{ textDecoration: 'underline', marginTop: '10px' }}>Additional Files</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.AdditionalFiles.Documentation}</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.AdditionalFiles.Requirements}</Typography>

    <Typography variant="h6" style={{ textDecoration: 'underline', marginTop: '10px' }}>Setup and Installation</Typography>
    <Typography style={{ marginLeft: '20px' }}>{summaryDetails.RepositorySummary.SetupAndInstallation}</Typography>
</CardContent>

</Card>

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Languages Used</Typography>
                                <Box display="flex" flexDirection="column" marginBottom={2}>
                                    {Object.entries(summaryDetails.languageLinks).map(([lang, url]) => (
                                        <Link key={lang} href={url} target="_blank" rel="noopener noreferrer" style={{ color: getColor(lang), marginBottom: 8 }}>
                                            {lang}
                                        </Link>
                                    ))}
                                </Box>
                                <Typography variant="h6">Language Bar</Typography>
                                <LanguageBar languages={summaryDetails.languages} />
                            </CardContent>
                        </Card>
                        <Card style={{ marginTop: '20px' }}>
                            <CardContent>
                                <Typography variant="h6">GitHub Link</Typography>
                                <Link href={summaryDetails.githubLink} target="_blank" rel="noopener noreferrer">
                                    {summaryDetails.githubLink}
                                </Link>
                            </CardContent>
                        </Card>
                        <Card style={{ marginTop: '20px' }}>
                            <CardContent>
                                <Typography variant="h6">File Structure</Typography>
                                <TreeView
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                >
                                    {renderTree(fileStructureData)}
                                </TreeView>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
    
            {tabValue === 1 && (
                <Grid container spacing={2} style={{ marginTop: 20 }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <ReactMarkdown>{readmeContent}</ReactMarkdown>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
    
            {tabValue === 2 && (
                <Grid container spacing={2} style={{ marginTop: 20 }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">More About This Project</Typography>
                                {/* Include any additional links or resources here */}
                                <Typography style={{ paddingLeft: '20px' }}>
                                    <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginTop: '0px' }}>
                                        <li>
                                            Check out the <Link href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React documentation</Link> for more info.
                                        </li>
                                        <li>
                                            For information on the Meraki API, visit <Link href="https://developer.cisco.com/meraki/" target="_blank" rel="noopener noreferrer">Meraki API Documentation</Link>.
                                        </li>
                                        <li>
                                            To learn more about the Meraki Scanning API, go to <Link href="https://developer.cisco.com/meraki/scanning-api/" target="_blank" rel="noopener noreferrer">Meraki Scanning API Documentation</Link>.
                                        </li>
                                    </ul>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
    
            {/* You can add more tabs and their content here if needed */}
        </Container>
    );
    
}

export default HomePage;
