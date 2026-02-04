import React from "react";
import {
  Card,
  Badge,
  Button,
  ProgressBar,
  BarList,
  Tracker,
  Divider,
  Input,
  Label,
  Textarea,
  Checkbox,
  Switch,
  Toggle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Callout,
  Slider,
  RadioGroup,
  RadioGroupItem,
  Table,
  TableRoot,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  ProgressCircle,
  CategoryBar,
  SparkChart,
  AreaChart,
  BarChart,
  LineChart,
  DonutChart,
  DatePicker,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./components";

// Sample data for the dashboard
const kpiData = [
  { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", changeType: "positive" },
  { title: "Active Users", value: "2,350", change: "+180.1%", changeType: "positive" },
  { title: "Bounce Rate", value: "12.5%", change: "-5.2%", changeType: "negative" },
  { title: "Avg. Session", value: "2m 45s", change: "+12%", changeType: "positive" },
];

const websiteTrafficData = [
  { name: "google.com", value: 456 },
  { name: "twitter.com", value: 351 },
  { name: "youtube.com", value: 271 },
  { name: "reddit.com", value: 191 },
  { name: "linkedin.com", value: 91 },
];

const uptimeData = Array.from({ length: 30 }, (_, i) => {
  const random = Math.random();
  return {
    key: i,
    color: random > 0.9 ? "bg-red-500" : random > 0.8 ? "bg-yellow-500" : "bg-emerald-500",
    tooltip: `Day ${i + 1}: ${random > 0.9 ? "Downtime" : random > 0.8 ? "Degraded" : "Operational"}`,
  };
});

const projectProgress = [
  { name: "Website Redesign", progress: 78, variant: "default" as const },
  { name: "Mobile App", progress: 45, variant: "success" as const },
  { name: "API Integration", progress: 92, variant: "warning" as const },
  { name: "Database Migration", progress: 23, variant: "error" as const },
];

const chartData = [
  { month: "Jan", Sales: 4500, Profit: 1200 },
  { month: "Feb", Sales: 3800, Profit: 980 },
  { month: "Mar", Sales: 5200, Profit: 1450 },
  { month: "Apr", Sales: 4900, Profit: 1320 },
  { month: "May", Sales: 6100, Profit: 1890 },
  { month: "Jun", Sales: 5400, Profit: 1560 },
];

const donutData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 15 },
  { name: "Other", value: 5 },
];

const tableData = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", role: "Editor" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Inactive", role: "Viewer" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", status: "Active", role: "Editor" },
];

const sparkData = [12, 18, 14, 22, 19, 25, 23, 28, 31, 27, 33, 38];

export default function App() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [switchChecked, setSwitchChecked] = React.useState(false);
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tremor Dashboard
                </h1>
                <Badge variant="success">All Components</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Settings</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Settings</DialogTitle>
                      <DialogDescription>
                        Configure your dashboard preferences
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Enable notifications</Label>
                        <Switch id="notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode">Dark mode</Label>
                        <Switch id="dark-mode" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="secondary">Export</Button>
                <Button>New Report</Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Callout */}
          <Callout title="Welcome to Tremor Components" variant="default" className="mb-6">
            This dashboard showcases all 35+ components from the Tremor library, compiled at runtime using vibe-coding-bundler.
          </Callout>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpiData.map((kpi) => (
              <Card key={kpi.title}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {kpi.title}
                  </p>
                  <Badge variant={kpi.changeType === "positive" ? "success" : "error"}>
                    {kpi.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {kpi.value}
                </p>
                <SparkChart data={sparkData} type="area" color="blue" className="mt-2" />
              </Card>
            ))}
          </div>

          {/* Tabs Section */}
          <Card className="mb-8">
            <Tabs defaultValue="charts">
              <TabsList>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="forms">Form Controls</TabsTrigger>
                <TabsTrigger value="data">Data Display</TabsTrigger>
              </TabsList>

              {/* Charts Tab */}
              <TabsContent value="charts">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Sales & Profit Trend
                    </h3>
                    <AreaChart
                      data={chartData}
                      index="month"
                      categories={["Sales", "Profit"]}
                      colors={["blue", "emerald"]}
                      showAnimation
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Monthly Comparison
                    </h3>
                    <BarChart
                      data={chartData}
                      index="month"
                      categories={["Sales", "Profit"]}
                      colors={["violet", "amber"]}
                      showAnimation
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Performance Trend
                    </h3>
                    <LineChart
                      data={chartData}
                      index="month"
                      categories={["Sales", "Profit"]}
                      colors={["rose", "cyan"]}
                      showAnimation
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Device Distribution
                    </h3>
                    <DonutChart
                      data={donutData}
                      category="value"
                      index="name"
                      showLabel
                      showAnimation
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Forms Tab */}
              <TabsContent value="forms">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Type your message..." className="mt-1" />
                    </div>
                    <div>
                      <Label>Select an option</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Option 1</SelectItem>
                          <SelectItem value="2">Option 2</SelectItem>
                          <SelectItem value="3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date Picker</Label>
                      <DatePicker
                        value={date}
                        onChange={setDate}
                        className="mt-1"
                        placeholder="Pick a date"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={checkboxChecked}
                        onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)}
                      />
                      <Label>I agree to the terms</Label>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable notifications</Label>
                      <Switch
                        checked={switchChecked}
                        onCheckedChange={setSwitchChecked}
                      />
                    </div>
                    <div>
                      <Label>Volume: {sliderValue[0]}%</Label>
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Toggle Options</Label>
                      <div className="flex gap-2 mt-2">
                        <Toggle>Bold</Toggle>
                        <Toggle>Italic</Toggle>
                        <Toggle>Underline</Toggle>
                      </div>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <RadioGroup defaultValue="medium" className="mt-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low">Low</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high">High</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Data Tab */}
              <TabsContent value="data">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  User Directory
                </h3>
                <TableRoot>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Role</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Active" ? "success" : "neutral"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableRoot>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Traffic Sources */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Website Traffic Sources
              </h3>
              <BarList
                data={websiteTrafficData}
                valueFormatter={(value) => `${value} visits`}
                showAnimation
              />
            </Card>

            {/* Project Progress */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Progress
              </h3>
              <div className="space-y-6">
                {projectProgress.map((project) => (
                  <div key={project.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {project.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={project.progress}
                      variant={project.variant}
                      showAnimation
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Circular Progress & Category Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Completion Rate
              </h3>
              <ProgressCircle value={72} size="lg" variant="success" showAnimation>
                <span className="text-lg font-bold text-gray-900 dark:text-white">72%</span>
              </ProgressCircle>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Budget Allocation
              </h3>
              <CategoryBar
                values={[35, 25, 20, 15, 5]}
                colors={["blue", "emerald", "violet", "amber", "rose"]}
                markerValue={60}
                className="mt-4"
              />
              <div className="flex flex-wrap gap-2 mt-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-blue-500" /> Marketing
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500" /> Engineering
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-violet-500" /> Design
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-amber-500" /> Sales
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-rose-500" /> Other
                </span>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                  <div className="flex items-center gap-2">
                    <SparkChart data={[45, 52, 48, 61, 55, 67, 62]} type="line" color="blue" height={24} />
                    <span className="text-sm font-medium">62%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                  <div className="flex items-center gap-2">
                    <SparkChart data={[30, 35, 42, 38, 45, 40, 44]} type="bar" color="emerald" height={24} />
                    <span className="text-sm font-medium">44%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
                  <div className="flex items-center gap-2">
                    <SparkChart data={[80, 75, 85, 90, 82, 88, 92]} type="area" color="violet" height={24} />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* System Status */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Uptime
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last 30 days status tracker
                </p>
              </div>
              <Badge variant="success">99.2% Uptime</Badge>
            </div>
            <Tracker data={uptimeData} />
            <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </Card>

          {/* Accordion FAQ */}
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Tremor?</AccordionTrigger>
                <AccordionContent>
                  Tremor is a React library to build dashboards fast. It's built on top of Tailwind CSS and Radix UI, providing a set of modular components optimized for building data-intensive applications.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does runtime bundling work?</AccordionTrigger>
                <AccordionContent>
                  This demo uses vibe-coding-bundler, which leverages esbuild-wasm to compile TypeScript/JSX code directly in the browser. All component files are loaded into a virtual file system and bundled on-the-fly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I use these components in my project?</AccordionTrigger>
                <AccordionContent>
                  Yes! All components shown here follow Tremor's design patterns and can be used in any React project. Visit tremor.so for the official library with full documentation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Button Variants with Tooltips */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Button Variants
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Hover over buttons to see tooltips
            </p>
            <div className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="primary">Primary</Button>
                </TooltipTrigger>
                <TooltipContent>Main action button</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Secondary</Button>
                </TooltipTrigger>
                <TooltipContent>Secondary action</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="light">Light</Button>
                </TooltipTrigger>
                <TooltipContent>Light variant</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Ghost</Button>
                </TooltipTrigger>
                <TooltipContent>Minimal style</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive">Destructive</Button>
                </TooltipTrigger>
                <TooltipContent>Danger action</TooltipContent>
              </Tooltip>
              <Button variant="primary" isLoading loadingText="Loading...">
                Loading
              </Button>
            </div>

            <Divider>Badge Variants</Divider>

            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Built with{" "}
            <a
              href="https://tremor.so"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Tremor
            </a>
            {" components (35+ components) | Compiled at runtime by "}
            <a
              href="https://github.com/NimbleLabs/vibe-coding-bundler"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              vibe-coding-bundler
            </a>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
