-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<JeromeJose>
-- Create date: <Nov 9 2016>
-- Description:	<Description,,>
-- =============================================
create PROCEDURE [ITADMIN].[MenuSync_RunSqlCreateStatement]
	
  @SQL NVARCHAR(MAX) = ''

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
 
 
DECLARE @ERROR_SEVERITY AS INT 
DECLARE @ERROR_STATE AS INT 
DECLARE  @ErrorMessage	 as NVARCHAR(max)

   BEGIN TRY 
       BEGIN TRAN
		
		--run script
		EXEC sp_executesql @SQL
		
        COMMIT TRAN

        SET	@ErrorMessage = '100-Error Contact IT Administrator.'		
        SET @ERROR_SEVERITY = ERROR_SEVERITY()
        SET @ERROR_STATE = ERROR_STATE()		
        RAISERROR (@ErrorMessage, @ERROR_SEVERITY, @ERROR_STATE);       

    END TRY
    BEGIN CATCH                
	    SET	@ErrorMessage = N'There was an error: Ln: ' + cast(ERROR_LINE() as nvarchar(2048)) + N' Message: ' + ERROR_MESSAGE();		
	    SET @ERROR_SEVERITY = ERROR_SEVERITY()
	    SET @ERROR_STATE = ERROR_STATE()		
        RAISERROR (@ErrorMessage, @ERROR_SEVERITY, @ERROR_STATE);    
    END CATCH; 

 
END
GO
