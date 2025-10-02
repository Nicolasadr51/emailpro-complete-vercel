import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Mail, Users, MousePointer, Eye, AlertCircle, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';

const StatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('opens');

  // Données simulées pour les graphiques
  const performanceData = [
    { date: '2024-09-01', envois: 1200, ouvertures: 480, clics: 96, conversions: 24 },
    { date: '2024-09-02', envois: 1350, ouvertures: 540, clics: 108, conversions: 27 },
    { date: '2024-09-03', envois: 1100, ouvertures: 440, clics: 88, conversions: 22 },
    { date: '2024-09-04', envois: 1450, ouvertures: 580, clics: 116, conversions: 29 },
    { date: '2024-09-05', envois: 1300, ouvertures: 520, clics: 104, conversions: 26 },
    { date: '2024-09-06', envois: 1600, ouvertures: 640, clics: 128, conversions: 32 },
    { date: '2024-09-07', envois: 1250, ouvertures: 500, clics: 100, conversions: 25 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 40, color: '#EF4444' },
    { name: 'Tablet', value: 15, color: '#10B981' }
  ];

  const emailClientData = [
    { name: 'Gmail', value: 35, color: '#EA4335' },
    { name: 'Outlook', value: 25, color: '#0078D4' },
    { name: 'Apple Mail', value: 20, color: '#007AFF' },
    { name: 'Yahoo', value: 12, color: '#7B0099' },
    { name: 'Autres', value: 8, color: '#6B7280' }
  ];

  const topCampaigns = [
    {
      id: '1',
      name: 'Newsletter Septembre 2024',
      envois: 2500,
      ouvertures: 1000,
      clics: 200,
      conversions: 50,
      tauxOuverture: 40.0,
      tauxClic: 8.0,
      tauxConversion: 2.0,
      date: '2024-09-15'
    },
    {
      id: '2',
      name: 'Promotion Rentrée',
      envois: 1800,
      ouvertures: 720,
      clics: 144,
      conversions: 36,
      tauxOuverture: 40.0,
      tauxClic: 8.0,
      tauxConversion: 2.0,
      date: '2024-09-10'
    },
    {
      id: '3',
      name: 'Webinar Invitation',
      envois: 1200,
      ouvertures: 600,
      clics: 120,
      conversions: 30,
      tauxOuverture: 50.0,
      tauxClic: 10.0,
      tauxConversion: 2.5,
      date: '2024-09-08'
    }
  ];

  // Métriques principales
  const mainMetrics = {
    totalEnvois: 45650,
    totalOuvertures: 18260,
    totalClics: 3652,
    totalConversions: 913,
    tauxOuverture: 40.0,
    tauxClic: 8.0,
    tauxConversion: 2.0,
    tauxDesabonnement: 0.5
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
            <p className="text-muted-foreground">
              Analysez les performances de vos campagnes email
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="90d">90 derniers jours</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(mainMetrics.totalEnvois)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs période précédente
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'Ouverture</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(mainMetrics.tauxOuverture)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% vs période précédente
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Clic</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(mainMetrics.tauxClic)}</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.3% vs période précédente
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(mainMetrics.tauxConversion)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.5% vs période précédente
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Performances</CardTitle>
                <CardDescription>
                  Suivi des métriques clés sur la période sélectionnée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                        formatter={(value, name) => [formatNumber(value), name]}
                      />
                      <Area type="monotone" dataKey="envois" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="ouvertures" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="clics" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="conversions" stackId="4" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Taux de Performance</CardTitle>
                  <CardDescription>Comparaison des taux d'engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux d'ouverture</span>
                      <span className="font-medium">{formatPercentage(mainMetrics.tauxOuverture)}</span>
                    </div>
                    <Progress value={mainMetrics.tauxOuverture} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de clic</span>
                      <span className="font-medium">{formatPercentage(mainMetrics.tauxClic)}</span>
                    </div>
                    <Progress value={mainMetrics.tauxClic} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de conversion</span>
                      <span className="font-medium">{formatPercentage(mainMetrics.tauxConversion)}</span>
                    </div>
                    <Progress value={mainMetrics.tauxConversion} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de désabonnement</span>
                      <span className="font-medium text-red-600">{formatPercentage(mainMetrics.tauxDesabonnement)}</span>
                    </div>
                    <Progress value={mainMetrics.tauxDesabonnement} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution Hebdomadaire</CardTitle>
                  <CardDescription>Comparaison des envois par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { weekday: 'short' })}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                          formatter={(value) => [formatNumber(value), 'Envois']}
                        />
                        <Bar dataKey="envois" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Appareil</CardTitle>
                  <CardDescription>Comment vos emails sont-ils consultés ?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clients Email</CardTitle>
                  <CardDescription>Répartition par client email</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={emailClientData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {emailClientData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analyse de l'Engagement</CardTitle>
                <CardDescription>Détails sur l'engagement de votre audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-muted-foreground">Taux de délivrabilité</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Eye className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold">12min</div>
                    <div className="text-sm text-muted-foreground">Temps de lecture moyen</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <MousePointer className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">3.2</div>
                    <div className="text-sm text-muted-foreground">Clics par ouverture</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Campagnes</CardTitle>
                <CardDescription>
                  Vos campagnes les plus performantes sur la période
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campagne</TableHead>
                      <TableHead className="text-right">Envois</TableHead>
                      <TableHead className="text-right">Ouvertures</TableHead>
                      <TableHead className="text-right">Clics</TableHead>
                      <TableHead className="text-right">Taux d'ouverture</TableHead>
                      <TableHead className="text-right">Taux de clic</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">
                          {campaign.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(campaign.envois)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(campaign.ouvertures)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(campaign.clics)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={campaign.tauxOuverture > 35 ? 'default' : 'secondary'}>
                            {formatPercentage(campaign.tauxOuverture)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={campaign.tauxClic > 5 ? 'default' : 'secondary'}>
                            {formatPercentage(campaign.tauxClic)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(campaign.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparaison des Campagnes</CardTitle>
                <CardDescription>Performance comparative des dernières campagnes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCampaigns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tauxOuverture" fill="#10B981" name="Taux d'ouverture (%)" />
                      <Bar dataKey="tauxClic" fill="#3B82F6" name="Taux de clic (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;
