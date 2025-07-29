import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, User, Building, MapPin, Clock, IdCard, Mail, Calendar } from "lucide-react"
import { CheckInData } from "@/types"
import { format } from "date-fns"

interface VisitorSummaryProps {
  checkInData: CheckInData
  onNewCheckIn?: () => void
  onBackToScanner?: () => void
  className?: string
}

export function VisitorSummary({ 
  checkInData, 
  onNewCheckIn, 
  onBackToScanner,
  className 
}: VisitorSummaryProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp")
    } catch {
      return dateString
    }
  }

  return (
    <div className={className}>
      {/* Success Alert */}
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Check-in completed successfully!</strong> The host has been notified via email.
        </AlertDescription>
      </Alert>

      {/* Visitor Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Visitor Check-In Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visitor Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Visitor Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Visitor Name</p>
                  <Badge variant="secondary" className="mt-1">
                    {checkInData.visitor.name}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Building className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Company</p>
                  <Badge variant="outline" className="mt-1">
                    {checkInData.visitor.company}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Meeting Room</p>
                  <Badge variant="outline" className="mt-1">
                    {checkInData.visitor.meetingRoom}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Host</p>
                  <Badge variant="secondary" className="mt-1">
                    {checkInData.host.name}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Purpose of Visit</p>
                <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                  {checkInData.visitor.purpose}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Check-in Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Check-In Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <Badge variant="default" className="mt-1">
                    {checkInData.checkIn.location}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">ID Verified</p>
                  <Badge variant="outline" className="mt-1">
                    {checkInData.checkIn.identification}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Checked In By</p>
                  <Badge variant="secondary" className="mt-1">
                    {checkInData.checkIn.checkedInBy}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Check-In Time</p>
                  <Badge variant="default" className="mt-1">
                    {formatDate(checkInData.checkIn.checkedInAt)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Host Notification */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Host Notification
            </h4>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Mail className="h-4 w-4 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-green-800">
                  Confirmation email sent to <span className="font-medium">{checkInData.host.email}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onBackToScanner && (
          <Button 
            variant="outline" 
            onClick={onBackToScanner}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
            Check In Another Visitor
          </Button>
        )}
        
        {onNewCheckIn && (
          <Button 
            onClick={onNewCheckIn}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Create New Invite
          </Button>
        )}
      </div>

      {/* Reference Information */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          Reference ID: <span className="font-mono">{checkInData.id}</span>
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Visitor created: {formatDate(checkInData.createdAt)}
        </p>
      </div>
    </div>
  )
} 