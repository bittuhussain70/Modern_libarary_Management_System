"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Upload, CheckCircle, AlertCircle, User, MapPin, GraduationCap, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

import { generateVerificationToken, sendVerificationEmail } from "../actions/email-verification"

// Registration steps
const REGISTRATION_STEPS = [
  { id: 1, title: "Personal Info", description: "Basic personal details" },
  { id: 2, title: "Academic Info", description: "Educational background" },
  { id: 3, title: "Contact Details", description: "Address and contact" },
  { id: 4, title: "Documents", description: "Upload required documents" },
  { id: 5, title: "Verification", description: "Review and submit" },
]

// Departments and programs
const DEPARTMENTS = [
  { id: "cs", name: "Computer Science", programs: ["B.Tech CS", "M.Tech CS", "PhD CS"] },
  { id: "ee", name: "Electrical Engineering", programs: ["B.Tech EE", "M.Tech EE", "PhD EE"] },
  { id: "me", name: "Mechanical Engineering", programs: ["B.Tech ME", "M.Tech ME", "PhD ME"] },
  { id: "ce", name: "Civil Engineering", programs: ["B.Tech CE", "M.Tech CE", "PhD CE"] },
  { id: "math", name: "Mathematics", programs: ["B.Sc Math", "M.Sc Math", "PhD Math"] },
  { id: "physics", name: "Physics", programs: ["B.Sc Physics", "M.Sc Physics", "PhD Physics"] },
  { id: "chemistry", name: "Chemistry", programs: ["B.Sc Chemistry", "M.Sc Chemistry", "PhD Chemistry"] },
  { id: "business", name: "Business Administration", programs: ["BBA", "MBA", "PhD Management"] },
]

// Document types
const REQUIRED_DOCUMENTS = [
  { id: "photo", name: "Passport Photo", required: true, maxSize: "2MB", formats: ["JPG", "PNG"] },
  { id: "id_proof", name: "Government ID Proof", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
  { id: "academic", name: "Academic Transcripts", required: true, maxSize: "10MB", formats: ["PDF"] },
  { id: "address", name: "Address Proof", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
  { id: "medical", name: "Medical Certificate", required: false, maxSize: "5MB", formats: ["PDF"] },
]

interface FormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string

  // Academic Info
  department: string
  program: string
  previousEducation: string
  gpa: string
  graduationYear: string

  // Contact Details
  address: string
  city: string
  state: string
  zipCode: string
  emergencyContact: string
  emergencyPhone: string

  // Account
  password: string
  confirmPassword: string

  // Preferences
  interests: string[]
  libraryPreferences: string[]

  // Documents
  documents: { [key: string]: File | null }

  // Terms
  agreeToTerms: boolean
  agreeToPrivacy: boolean
}

export default function StudentRegistration() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationMethod, setRegistrationMethod] = useState<"manual" | "bulk" | "import">("manual")

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    department: "",
    program: "",
    previousEducation: "",
    gpa: "",
    graduationYear: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    password: "",
    confirmPassword: "",
    interests: [],
    libraryPreferences: [],
    documents: {},
    agreeToTerms: false,
    agreeToPrivacy: false,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    switch (step) {
      case 1: // Personal Info
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.gender) newErrors.gender = "Gender is required"
        break

      case 2: // Academic Info
        if (!formData.department) newErrors.department = "Department is required"
        if (!formData.program) newErrors.program = "Program is required"
        if (!formData.previousEducation.trim()) newErrors.previousEducation = "Previous education is required"
        break

      case 3: // Contact Details
        if (!formData.address.trim()) newErrors.address = "Address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.state.trim()) newErrors.state = "State is required"
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        break

      case 5: // Verification
        if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"
        if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = "You must agree to the privacy policy"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, REGISTRATION_STEPS.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFileUpload = (documentType: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [documentType]: file },
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return

    setIsSubmitting(true)
    try {
      // Simulate API call to create user account
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate student ID
      const studentId = `${formData.department.toUpperCase()}${new Date().getFullYear()}${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`

      console.log("Registration submitted:", { ...formData, studentId })

      // Generate verification token and send verification email
      const token = await generateVerificationToken(formData.email)
      const emailResult = await sendVerificationEmail(
        formData.email,
        token,
        `${formData.firstName} ${formData.lastName}`,
      )

      if (emailResult.success) {
        // Redirect to pending verification page
        router.push(`/register/pending?email=${encodeURIComponent(formData.email)}&studentId=${studentId}`)
      } else {
        // Handle email sending failure
        setErrors({ submit: `Registration completed but failed to send verification email: ${emailResult.message}` })
      }
    } catch (error) {
      console.error("Registration failed:", error)
      setErrors({ submit: "Registration failed. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepProgress = () => (currentStep / REGISTRATION_STEPS.length) * 100

  const selectedDepartment = DEPARTMENTS.find((dept) => dept.id === formData.department)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-lg text-gray-600">
            Join our academic community and access our comprehensive library system
          </p>
        </div>

        {/* Registration Method Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Registration Method</CardTitle>
            <CardDescription>Choose how you'd like to register</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={registrationMethod} onValueChange={(value) => setRegistrationMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual">Manual Registration</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                <TabsTrigger value="import">Import from System</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-4">
                <Alert>
                  <User className="h-4 w-4" />
                  <AlertDescription>
                    Complete the registration form step by step with your personal information.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="bulk" className="mt-4">
                <Alert>
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    Upload a CSV file with multiple student records. Download the template first.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 space-y-4">
                  <Button variant="outline">Download CSV Template</Button>
                  <Input type="file" accept=".csv" />
                  <Button>Upload Student Data</Button>
                </div>
              </TabsContent>

              <TabsContent value="import" className="mt-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>Import student data from existing academic management systems.</AlertDescription>
                </Alert>
                <div className="mt-4 space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sis">Student Information System</SelectItem>
                      <SelectItem value="lms">Learning Management System</SelectItem>
                      <SelectItem value="erp">ERP System</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Connect and Import</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Manual Registration Form */}
        {registrationMethod === "manual" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Step {currentStep}: {REGISTRATION_STEPS[currentStep - 1].title}
                  </CardTitle>
                  <CardDescription>{REGISTRATION_STEPS[currentStep - 1].description}</CardDescription>
                </div>
                <Badge variant="outline">
                  {currentStep} of {REGISTRATION_STEPS.length}
                </Badge>
              </div>
              <Progress value={getStepProgress()} className="mt-4" />
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        placeholder="Enter your first name"
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        placeholder="Enter your last name"
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="Enter your email address"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                        className={errors.dateOfBirth ? "border-red-500" : ""}
                      />
                      {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                        <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => updateFormData("nationality", e.target.value)}
                        placeholder="Enter your nationality"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Academic Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => updateFormData("department", value)}
                      >
                        <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="program">Program *</Label>
                      <Select
                        value={formData.program}
                        onValueChange={(value) => updateFormData("program", value)}
                        disabled={!formData.department}
                      >
                        <SelectTrigger className={errors.program ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedDepartment?.programs.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.program && <p className="text-sm text-red-500">{errors.program}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousEducation">Previous Education *</Label>
                    <Textarea
                      id="previousEducation"
                      value={formData.previousEducation}
                      onChange={(e) => updateFormData("previousEducation", e.target.value)}
                      placeholder="Describe your previous educational background"
                      className={errors.previousEducation ? "border-red-500" : ""}
                    />
                    {errors.previousEducation && <p className="text-sm text-red-500">{errors.previousEducation}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA/Percentage</Label>
                      <Input
                        id="gpa"
                        value={formData.gpa}
                        onChange={(e) => updateFormData("gpa", e.target.value)}
                        placeholder="Enter your GPA or percentage"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        value={formData.graduationYear}
                        onChange={(e) => updateFormData("graduationYear", e.target.value)}
                        placeholder="e.g., 2028"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Academic Interests</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        "Research",
                        "Programming",
                        "Mathematics",
                        "Physics",
                        "Literature",
                        "History",
                        "Science",
                        "Technology",
                        "Arts",
                        "Sports",
                      ].map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("interests", [...formData.interests, interest])
                              } else {
                                updateFormData(
                                  "interests",
                                  formData.interests.filter((i) => i !== interest),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={interest} className="text-sm">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details & Account */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      placeholder="Enter your full address"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        placeholder="Enter city"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                        placeholder="Enter state"
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                        placeholder="Enter ZIP code"
                        className={errors.zipCode ? "border-red-500" : ""}
                      />
                      {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                        placeholder="Enter emergency contact name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                        placeholder="Enter emergency contact phone"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Security</h3>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                          placeholder="Create a strong password"
                          className={errors.password ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                          placeholder="Confirm your password"
                          className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Document Upload */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Upload Required Documents</h3>
                    <p className="text-gray-600">Please upload the following documents to complete your registration</p>
                  </div>

                  <div className="space-y-4">
                    {REQUIRED_DOCUMENTS.map((doc) => (
                      <Card key={doc.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{doc.name}</h4>
                            {doc.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Max: {doc.maxSize} | Formats: {doc.formats.join(", ")}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept={doc.formats.map((f) => `.${f.toLowerCase()}`).join(",")}
                            onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0] || null)}
                            className="flex-1"
                          />
                          {formData.documents[doc.id] && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Uploaded</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      All documents will be verified by the administration. Please ensure all information is accurate
                      and documents are clear and legible.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 5: Review and Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Review Your Information</h3>
                    <p className="text-gray-600">Please review all information before submitting your registration</p>
                  </div>

                  <div className="grid gap-6">
                    {/* Personal Information Summary */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Name:</strong> {formData.firstName} {formData.lastName}
                        </div>
                        <div>
                          <strong>Email:</strong> {formData.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {formData.phone}
                        </div>
                        <div>
                          <strong>Date of Birth:</strong> {formData.dateOfBirth}
                        </div>
                      </div>
                    </Card>

                    {/* Academic Information Summary */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Academic Information
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Department:</strong> {DEPARTMENTS.find((d) => d.id === formData.department)?.name}
                        </div>
                        <div>
                          <strong>Program:</strong> {formData.program}
                        </div>
                        <div>
                          <strong>Expected Graduation:</strong> {formData.graduationYear}
                        </div>
                        <div>
                          <strong>Interests:</strong> {formData.interests.join(", ")}
                        </div>
                      </div>
                    </Card>

                    {/* Contact Information Summary */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Contact Information
                      </h4>
                      <div className="text-sm">
                        <div>
                          <strong>Address:</strong> {formData.address}
                        </div>
                        <div>
                          <strong>City, State ZIP:</strong> {formData.city}, {formData.state} {formData.zipCode}
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the{" "}
                        <a href="/terms" className="text-blue-600 hover:underline">
                          Terms and Conditions
                        </a>{" "}
                        *
                      </Label>
                    </div>
                    {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onCheckedChange={(checked) => updateFormData("agreeToPrivacy", checked)}
                      />
                      <Label htmlFor="agreeToPrivacy" className="text-sm">
                        I agree to the{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>{" "}
                        *
                      </Label>
                    </div>
                    {errors.agreeToPrivacy && <p className="text-sm text-red-500">{errors.agreeToPrivacy}</p>}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                  Previous
                </Button>

                {currentStep < REGISTRATION_STEPS.length ? (
                  <Button onClick={nextStep}>Next</Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
