Imports System
Public NotInheritable Class Encryption

    Public Function EnCryptNew(ByVal StringToEncrypt As String) As String

Remarks:
        '   The following function takes the parameter 'StringToEncrypt' and performs
        '   multiple mathematical transformations on it.  Every step has been
        '   documented through remarks to cut down on confusion of the process
        '   itself.  Upon any error, the error is ignored and execution of the
        '   function continues.  It is suggested that you do not attempt to encrypt
        '   more than 5k to 10k at once because the function is so memory intensive.
        '   For instance, on a 200 Mhz, with 128 MB RAM and Win98 SE, an uncompiled
        '   version of this function averaged the following times (over a period of
        '   ten trials):
        '
        '               1000 characters (1K)    -   3333 characters per second
        '               3000 characters (3K)    -   1500 characters per second
        '               5000 characters (5K)    -   1000 characters per second
        '               8000 characters (8K)    -    707 characters per second
        '
        '   At 11K, the machine locked up and an 'out of memory' error arose.  It is
        '   projected that the same machine would only do 418 characters per second
        '   on 10K, 58 characters per second on 20K, and 0.158 characters per second
        '   on 50K (all based on eighty trials).  It is strongly suggested that you
        '   encrypt 5K at a time and then concatenate the strings.  Furthermore, size
        '   needs to be taken into account.  The encrypted string will generally be
        '   between 3.9 and 4.1 times the size of the original string.  For instance,
        '   a 10k string might produce sizes between the ranges of 39K and 41K.
        '   Thus, it doesn't make sense to try to encrypt a 20MB file, unless you
        '   have the space.

OnError:
        On Error GoTo errHandler

Dimensions:
        Dim intMousePointer As Integer
        Dim dblCountLength As Double
        Dim intRandomNumber As Integer
        Dim strCurrentChar As String
        Dim intAscCurrentChar As Integer
        Dim intInverseAsc As Integer
        Dim intAddNinetyNine As Integer
        Dim dblMultiRandom As Double
        Dim dblWithRandom As Double
        Dim intCountPower As Integer
        Dim intPower As Integer
        Dim strConvertToBase As String

Constants:
        Const intLowerBounds = 10
        Const intUpperBounds = 28

MainCode:
        '   Store the current value of the mouse pointer
        'intMousePointer = Cursor.Position
        '   Change the mousepointer to an hourglass.
        'Cursor.Current = Cursors.WaitCursor
        '   Start a For...Next loop that counts through the length of the parameter
        '   'StringToEncrypt'
        For dblCountLength = 1 To Len(StringToEncrypt)
            Randomize()
            intRandomNumber = Int((intUpperBounds - intLowerBounds + 1) * Rnd() + _
                  intLowerBounds)
            strCurrentChar = Mid(StringToEncrypt, dblCountLength, 1)
            intAscCurrentChar = Asc(strCurrentChar)
            intInverseAsc = 256 - intAscCurrentChar
            intAddNinetyNine = intInverseAsc + 99
            dblMultiRandom = intAddNinetyNine * intRandomNumber
            dblWithRandom = Mid(dblMultiRandom, 1, 2) & intRandomNumber & _
                  Mid(dblMultiRandom, 3, 2)
            For intCountPower = 0 To 5
                If dblWithRandom / (93 ^ intCountPower) >= 1 Then
                    intPower = intCountPower
                End If
            Next intCountPower
            strConvertToBase = ""
            For intCountPower = intPower To 0 Step -1
                strConvertToBase = strConvertToBase & _
                    Chr(Int(dblWithRandom / (93 ^ intCountPower)) + 33)
                dblWithRandom = dblWithRandom Mod 93 ^ intCountPower
            Next intCountPower
            EnCryptNew = EnCryptNew & Len(strConvertToBase) & strConvertToBase
        Next dblCountLength
        'Cursor.Current = intMousePointer
        Exit Function

errHandler:
        '   Begin selecting occurences of an error number when an error has occured
        Select Case Err.Number
            '   For all occurences of an error number, do what follows
            Case Else
                '   Erase the error
                Err.Clear()
                '   Go to the line of code that follows the error
                Resume Next
                '   Stop selecting occurences of an error number
        End Select

    End Function
    Public Function DecryptNew(ByVal StringToDecrypt As String) As String

Remarks:
        '   The following function takes the parameter 'StringToDecrypt' and performs
        '   multiple mathematical transformations on it.  Every step has been
        '   documented through remarks to cut down on confusion of the process
        '   itself.  Upon any error, the error is ignored and execution of the
        '   function continues.  Unlike the 'Encrypt' function, this function has
        '   proved itself to be virtually limitless in comparison.  For instance, on
        '   a 200 Mhz, with 128 MB RAM and Win98 SE, an uncompiled version of this
        '   function averaged the following times (over a period of ten trials):
        '
        '               1000 characters  (1K)    -   10000 characters per second
        '               3000 characters  (3K)    -   30000 characters per second
        '               5000 characters  (5K)    -   25000 characters per second
        '               8000 characters  (8K)    -   13333 characters per second
        '              10000 characters (10K)    -   25000 characters per second
        '              20000 characters (20K)    -   28571 characters per second
        '              30000 characters (30K)    -   20000 characters per second
        '
        '   In fact, after 120 trials that ranged from 1K to 30K, the function
        '   averaged 24769 characters per second.  There must be a size constraint,
        '   based on memory and processor, but it has not been found yet.

OnError:
        On Error GoTo errHandler

Dimensions:
        Dim intMousePointer As Integer
        Dim dblCountLength As Double
        Dim intLengthChar As Integer
        Dim strCurrentChar As String
        Dim dblCurrentChar As Double
        Dim intCountChar As Integer
        Dim intRandomSeed As Integer
        Dim intBeforeMulti As Integer
        Dim intAfterMulti As Integer
        Dim intSubNinetyNine As Integer
        Dim intInverseAsc As Integer

Constants:
        '   [None]

MainCode:
        '   Store the current value of the mouse pointer
        'intMousePointer = Cursor.Position
        '   Change the mousepointer to an hourglass.
        'Cursor.Current = Cursors.WaitCursor
        '   Start a For...Next loop that counts through the length of the parameter
        '   'StringToDecrypt'
        For dblCountLength = 1 To Len(StringToDecrypt)
            '   Place the character at 'dblCountLength' into the variable
            '   'intLengthChar'
            intLengthChar = Mid(StringToDecrypt, dblCountLength, 1)
            '   Place the string 'intLengthChar' long, directly following
            '   'dblCountLength' into the variable 'strCurrentChar'
            strCurrentChar = Mid(StringToDecrypt, dblCountLength + 1, _
                intLengthChar)
            '   Let the variable 'dblCurrentChar' be equal to 0
            dblCurrentChar = 0
            '   Start a For...Next loop that counts through the length of the
            '   variable 'strCurrentChar'
            For intCountChar = 1 To Len(strCurrentChar)
                '   Convert the variable 'strCurrent' from base 98 to base 10 and
                '   place the value into the variable 'dblCurrentChar'
                dblCurrentChar = dblCurrentChar + (Asc(Mid(strCurrentChar, _
                    intCountChar, 1)) - 33) * (93 ^ (Len(strCurrentChar) - _
                    intCountChar))
                '   Go to the next character in the variable 'strCurrentChar'
            Next intCountChar
            '   Determine the random number that was used in the 'Encrypt' function
            intRandomSeed = Mid(dblCurrentChar, 3, 2)
            '   Determine the number that represents the character without the random
            '   seed
            intBeforeMulti = Mid(dblCurrentChar, 1, 2) & Mid(dblCurrentChar, 5, _
                2)
            '   Divide the number that represents the character by the random seed
            '   and place that value into the variable 'intAfterMulti'
            intAfterMulti = intBeforeMulti / intRandomSeed
            '   Subtract 99 from the variable 'intAfterMulti' and place that value
            '   into the variable 'intSubNinetyNine'
            intSubNinetyNine = intAfterMulti - 99
            '   Subtract the variable 'intSubNinetyNine' from 256 and place that
            '   value into the variable 'intInverseAsc'
            intInverseAsc = 256 - intSubNinetyNine
            '   Place the character equivalent of the variable 'intInverseAsc' at the
            '   end of the function 'Decrypt'
            DecryptNew = DecryptNew & Chr(intInverseAsc)
            '   Add the variable 'intLengthChar' to 'dblCountLength' to ensure that
            '   the next character is being analyzed
            dblCountLength = dblCountLength + intLengthChar
            '   Go to the next character in the variable 'StringToEncrypt'
        Next dblCountLength
        '   Return the mousepointer to the value that it was before the function
        '   started
        'Cursor.Current.Position = intMousePointer
        '' Exit Function

        Return DecryptNew

errHandler:
        '   Begin selecting occurences of an error number when an error has occured
        Select Case Err.Number
            '   For all occurences of an error number, do what follows
            Case Else
                '   Erase the error
                Err.Clear()
                '   Go to the line of code that follows the error
                Resume Next
                '   Stop selecting occurences of an error number
        End Select

    End Function

End Class