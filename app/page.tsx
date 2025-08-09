'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Calendar, CheckCircle2, Cloud, DollarSign, FileText, Filter, Inbox, Layers, Loader2, Mail,
  MessageSquare, PanelLeft, Plus, Search, Server, Settings, ShieldCheck, Slack, Upload, Users,
  Youtube, ArrowUpRight, AlertTriangle, ChevronRight, Folder, Bell, X
} from 'lucide-react';
import { motion } from 'framer-motion';

const tasks = [
  { id: 'T-1087', title: 'Edit Street Interview – Miami Beach EP12', assignee: 'Aishwarya M.', stage: 'Editing', due: 'Aug 12', priority: 'High', client: 'The Dating Blind Show' },
  { id: 'T-1088', title: 'QC – Casino UGC Reels (x4)', assignee: 'Rahul K.', stage: 'QC', due: 'Aug 10', priority: 'Medium', client: 'Casino Client' },
  { id: 'T-1089', title: 'Schedule – YouTube Premiere EP23', assignee: 'Luis G.', stage: 'Scheduling', due: 'Aug 11', priority: 'High', client: 'MissBehaveTV' },
  { id: 'T-1090', title: 'Client Delivery – CLA Spotlight Cutdowns', assignee: 'Neha P.', stage: 'Delivery', due: 'Today', priority: 'Low', client: 'CLA' },
];

const team = [
  { name: 'Aishwarya M.', role: 'Editor', email: 'aish@e8.co', slack: '@aish', rate: 1800, status: 'Active' },
  { name: 'Rahul K.', role: 'Quality Control', email: 'rahul@e8.co', slack: '@rahul', rate: 2000, status: 'Active' },
  { name: 'Neha P.', role: 'Scheduling', email: 'neha@e8.co', slack: '@neha', rate: 1500, status: 'Active' },
  { name: 'Luis G.', role: 'Host / Producer', email: 'luis@e8.co', slack: '@luis', rate: 2500, status: 'Inactive' },
];

const payments = [
  { week: 'Aug 4–10', people: 12, amount: 8400, status: 'Due Monday' },
  { week: 'Jul 28–Aug 3', people: 11, amount: 7900, status: 'Paid' },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'qc' | 'schedule' | 'reports'>('tasks');
  const [openTask, setOpenTask] = useState<typeof tasks[number] | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/90 border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <PanelLeft className="h-5 w-5" />
          <div className="font-semibold">E8 Productions</div>
          <div className="text-neutral-400">/</div>
          <div className="font-medium">Workflow Manager</div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
              <Input placeholder="Search tasks, people, clients…" className="pl-8 w-64" />
            </div>
            <Button variant="ghost" aria-label="Notifications"><Bell className="h-5 w-5" /></Button>
            <Button className="rounded-2xl">New Task <Plus className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 grid grid-cols-12 gap-4">
        <aside className="col-span-3 xl:col-span-2 space-y-2">
          {NavItem({ icon: <Inbox className="h-4 w-4" />, label: 'Dashboard', active: activeTab === 'tasks', onClick: () => setActiveTab('tasks') })}
          {NavItem({ icon: <Layers className="h-4 w-4" />, label: 'Tasks', active: activeTab === 'tasks', onClick: () => setActiveTab('tasks') })}
          {NavItem({ icon: <CheckCircle2 className="h-4 w-4" />, label: 'Quality Control', active: activeTab === 'qc', onClick: () => setActiveTab('qc') })}
          {NavItem({ icon: <Calendar className="h-4 w-4" />, label: 'Scheduling', active: activeTab === 'schedule', onClick: () => setActiveTab('schedule') })}
          {NavItem({ icon: <FileText className="h-4 w-4" />, label: 'Reports', active: activeTab === 'reports', onClick: () => setActiveTab('reports') })}

          <Card className="mt-4">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Integrations</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2">
              {IntegrateRow({ icon: <Slack className="h-4 w-4" />, label: 'Slack', status: 'Connected' })}
              {IntegrateRow({ icon: <Cloud className="h-4 w-4" />, label: 'Google Drive', status: 'Connected' })}
              {IntegrateRow({ icon: <Server className="h-4 w-4" />, label: 'Private Server', status: 'Planned' })}
            </CardContent>
          </Card>
        </aside>

        <main className="col-span-9 xl:col-span-10 space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {KpiCard({ title: 'Open Tasks', value: '64', sub: '12 overdue', icon: <Loader2 className="h-5 w-5" />, trend: '+8 this week' })}
            {KpiCard({ title: 'Awaiting QC', value: '9', sub: '3 urgent', icon: <CheckCircle2 className="h-5 w-5" />, trend: '-2 today' })}
            {KpiCard({ title: 'Scheduled', value: '27', sub: 'this week', icon: <Calendar className="h-5 w-5" />, trend: 'YouTube / IG / FB' })}
            {KpiCard({ title: 'Payments', value: '$8,400', sub: 'due Monday', icon: <DollarSign className="h-5 w-5" />, trend: '12 creators' })}
          </div>

          {/* key={activeTab} forces re-mount so Tabs pick up the new defaultValue */}
          <Tabs defaultValue={activeTab} className="mt-2" key={activeTab}>
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="qc">Quality Control</TabsTrigger>
              <TabsTrigger value="schedule">Scheduling</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* TASKS */}
            <TabsContent value="tasks" className="space-y-3">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Active Tasks</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Filter by client or assignee" className="w-64" />
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filters</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"> </TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Due</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell><Checkbox /></TableCell>
                            <TableCell>{t.id}</TableCell>
                            <TableCell className="font-medium">{t.title}</TableCell>
                            <TableCell>{t.assignee}</TableCell>
                            <TableCell><Badge variant="secondary">{t.stage}</Badge></TableCell>
                            <TableCell>{t.due}</TableCell>
                            <TableCell>
                              <Badge className={t.priority === 'High' ? 'bg-red-500' : t.priority === 'Medium' ? 'bg-amber-500' : 'bg-neutral-500'}>
                                {t.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{t.client}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" onClick={() => setOpenTask(t)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* QC */}
            <TabsContent value="qc">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Quality Control Queue</CardTitle>
                  <Button variant="outline"><CheckCircle2 className="mr-2 h-4 w-4" />Approve Selected</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid lg:grid-cols-3 gap-3">
                    {tasks.slice(0, 3).map((t) => (
                      <Card key={t.id} className="overflow-hidden">
                        <CardHeader className="pb-1">
                          <CardTitle className="text-sm flex items-center gap-2"><Youtube className="h-4 w-4" /> {t.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video bg-neutral-200 rounded-xl mb-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">{t.client}</span>
                            <Badge variant="secondary">{t.stage}</Badge>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm"><CheckCircle2 className="mr-2 h-4 w-4" />Approve</Button>
                            <Button size="sm" variant="outline"><MessageSquare className="mr-2 h-4 w-4" />Request Changes</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-xs text-neutral-500">QC actions trigger Slack pings and email to the client on final approval.</div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SCHEDULE */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Publishing Calendar</CardTitle>
                  <Button variant="outline"><Calendar className="mr-2 h-4 w-4" />Export Week</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, idx) => (
                      <div key={d} className="bg-white rounded-2xl border p-3 min-h-[140px]">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>{d}</span><span className="font-medium">Aug {12 + idx}</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          <Badge variant="secondary" className="w-full justify-between">EP23 Premiere <ChevronRight className="h-3 w-3" /></Badge>
                          {idx % 2 === 0 && (
                            <Badge variant="secondary" className="w-full justify-between">Casino Reel #3 <ChevronRight className="h-3 w-3" /></Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* REPORTS */}
            <TabsContent value="reports" className="space-y-3">
              <div className="grid lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader><CardTitle>Daily Summary</CardTitle></CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• 18 tasks completed • 9 approved • 4 sent to client</p>
                    <p>• 12 pending QC • 6 overdue • 27 scheduled posts</p>
                    <p className="text-neutral-500">Auto-emailed 7pm to management & finance.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Week</TableHead>
                            <TableHead>People</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((p) => (
                            <TableRow key={p.week}>
                              <TableCell>{p.week}</TableCell>
                              <TableCell>{p.people}</TableCell>
                              <TableCell>${p.amount.toLocaleString()}</TableCell>
                              <TableCell><Badge variant={p.status === 'Paid' ? 'default' : 'secondary'}>{p.status}</Badge></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> 3 tasks overdue (QC)</div>
                    <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Backups completed 02:00</div>
                    <div className="flex items-center gap-2"><Server className="h-4 w-4 text-neutral-700" /> Drive sync healthy</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Team Directory</CardTitle>
                  <Button variant="outline"><Users className="mr-2 h-4 w-4" />Invite Member</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Slack</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rate / wk</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {team.map((m) => (
                          <TableRow key={m.email}>
                            <TableCell className="font-medium">{m.name}</TableCell>
                            <TableCell>{m.role}</TableCell>
                            <TableCell>{m.slack}</TableCell>
                            <TableCell>{m.email}</TableCell>
                            <TableCell>${m.rate}</TableCell>
                            <TableCell><Badge variant={m.status === 'Active' ? 'default' : 'secondary'}>{m.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Simple right-side drawer for task details */}
      {openTask && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenTask(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl border-l p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{openTask.id}: {openTask.title}</h3>
              <Button variant="ghost" onClick={() => setOpenTask(null)} aria-label="Close"><X className="h-5 w-5" /></Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                {LabelRow({ label: 'Assignee', value: openTask.assignee })}
                {LabelRow({ label: 'Client', value: openTask.client })}
                {LabelRow({ label: 'Stage', value: openTask.stage })}
                {LabelRow({ label: 'Due', value: openTask.due })}
              </div>
              <div className="space-y-2">
                {LabelRow({ label: 'Drive Folder', value: '/E8/Projects/EP12', icon: <Folder className="h-4 w-4" /> })}
                {LabelRow({ label: 'Slack Channel', value: '#e8-ep12', icon: <Slack className="h-4 w-4" /> })}
                {LabelRow({ label: 'Delivery Email', value: 'client@brand.com', icon: <Mail className="h-4 w-4" /> })}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Select defaultValue="Editing">
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Change stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Editing">Editing</SelectItem>
                  <SelectItem value="QC">QC</SelectItem>
                  <SelectItem value="Scheduling">Scheduling</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
              <Button>Move Stage <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Add Files</Button>
            </div>

            <div className="mt-2 text-sm text-neutral-500">* Actions are illustrative in this mock.</div>
          </div>
        </div>
      )}

      <footer className="border-t py-6 mt-6">
        <div className="mx-auto max-w-7xl px-4 text-xs text-neutral-500 flex items-center justify-between">
          <span>E8 Workflow Manager • UI mock • v0.1</span>
          <span>Planned: API access • Custom workflows • Role-based permissions</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({
  icon, label, active, onClick,
}: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer ${active ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white hover:bg-neutral-50 border-neutral-200'}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function KpiCard({ title, value, sub, icon, trend }: { title: string; value: string; sub?: string; icon?: React.ReactNode; trend?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-neutral-600">{icon}{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{value}</div>
          <div className="text-sm text-neutral-500">{sub}</div>
          {trend && <div className="mt-1 text-xs text-neutral-400">{trend}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function IntegrateRow({ icon, label, status }: { icon: React.ReactNode; label: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-xl border">
      <div className="flex items-center gap-2"><span>{icon}</span><span className="text-sm">{label}</span></div>
      <Badge variant={status === 'Connected' ? 'default' : 'secondary'}>{status}</Badge>
    </div>
  );
}

function LabelRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="text-sm flex items-center justify-between gap-2">
      <span className="text-neutral-500 flex items-center gap-2">{icon}{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
