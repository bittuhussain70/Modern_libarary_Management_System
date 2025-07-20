"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BulkUploadResult {
  total: number
  successful: number
  failed: number
  errors: Array<{
    row: number
    field: string
    message: string
  }>
}

export default function BulkRegistration() {
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
      // Preview first few rows
      const mockPreview = [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@student.college.edu",
          department: "Computer Science",
          program: "B.Tech CS",
          phone: "+1-555-0123",
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@student.college.edu",
          department: "Electrical Engineering",
          program: "B.Tech EE",
          phone: "+1-555-0124",
        },
      ]
      setPreviewData(mockPreview)
    }
  }

  const processBulkUpload = async () => {
    if (!uploadFile) return

    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock results
    setUploadResult({
      total: 50,
      successful: 47,
      failed: 3,
      errors: [
        { row: 15, field: "email", message: "Invalid email format" },
        { row: 23, field: "phone", message: "Phone number required" },
        { row: 34, field: "department", message: "Invalid department code" },
      ],
    })

    setIsProcessing(false)
  }

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = `firstName,lastName,email,phone,dateOfBirth,gender,department,program,address,city,state,zipCode
John,Doe,john.doe@student.college.edu,+1-555-0123,1995-01-15,male,cs,B.Tech CS,123 Main St,Anytown,CA,12345
Jane,Smith,jane.smith@student.college.edu,+1-555-0124,1996-03-22,female,ee,B.Tech EE,456 Oak Ave,Somewhere,NY,67890`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "student_registration_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bulk Student Registration</h1>
          <p className="text-lg text-gray-600">Upload multiple student records at once using CSV format</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="preview">Preview Data</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Template Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Template
                  </CardTitle>
                  <CardDescription>Download the CSV template with required fields and sample data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      The template includes all required fields with proper formatting examples.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={downloadTemplate} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV Template
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    <h4 className="font-medium mb-2">Required Fields:</h4>
                    <ul className="space-y-1">
                      <li>• firstName, lastName</li>
                      <li>• email (must be unique)</li>
                      <li>• phone, dateOfBirth</li>
                      <li>• department, program</li>
                      <li>• address, city, state, zipCode</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload CSV File
                  </CardTitle>
                  <CardDescription>Select your CSV file with student registration data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="csvFile">CSV File</Label>
                    <Input id="csvFile" type="file" accept=".csv" onChange={handleFileUpload} />
                  </div>

                  {uploadFile && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        File selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={processBulkUpload} disabled={!uploadFile || isProcessing} className="w-full">
                    {isProcessing ? "Processing..." : "Upload and Process"}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={66} />
                      <p className="text-sm text-center text-muted-foreground">Processing student records...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">✓ Do's</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Use the provided CSV template</li>
                      <li>• Ensure all required fields are filled</li>
                      <li>• Use valid email formats</li>
                      <li>• Check department codes are correct</li>
                      <li>• Verify phone number formats</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">✗ Don'ts</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Don't modify column headers</li>
                      <li>• Don't include duplicate email addresses</li>
                      <li>• Don't use special characters in names</li>
                      <li>• Don't leave required fields empty</li>
                      <li>• Don't exceed 1000 records per file</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>Review the first few records from your uploaded file</CardDescription>
              </CardHeader>
              <CardContent>
                {previewData.length > 0 ? (
                  <div className="space-y-4">
                    <Alert>
                      <Eye className="h-4 w-4" />
                      <AlertDescription>
                        Showing preview of first {previewData.length} records. Total records to be processed:{" "}
                        {previewData.length * 25}
                      </AlertDescription>
                    </Alert>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {record.firstName} {record.lastName}
                            </TableCell>
                            <TableCell>{record.email}</TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell>{record.program}</TableCell>
                            <TableCell>{record.phone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>No data to preview. Please upload a CSV file first.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <div className="space-y-6">
              {uploadResult ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{uploadResult.total}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Successful</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{uploadResult.successful}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Failed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{uploadResult.failed}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Success Alert */}
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Bulk upload completed! {uploadResult.successful} students were successfully registered.
                      {uploadResult.failed > 0 && ` ${uploadResult.failed} records failed validation.`}
                    </AlertDescription>
                  </Alert>

                  {/* Errors Table */}
                  {uploadResult.errors.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <X className="w-5 h-5 text-red-600" />
                          Validation Errors
                        </CardTitle>
                        <CardDescription>
                          The following records failed validation and were not processed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Row</TableHead>
                              <TableHead>Field</TableHead>
                              <TableHead>Error Message</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {uploadResult.errors.map((error, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Badge variant="outline">{error.row}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{error.field}</TableCell>
                                <TableCell className="text-red-600">{error.message}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download Success Report
                    </Button>
                    {uploadResult.failed > 0 && (
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Error Report
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No upload results available. Please upload and process a file first.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
