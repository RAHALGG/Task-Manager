const QuickActionsBar = () => {
  return (
    <ActionsContainer>
      {/* إضافة مهمة سريعة */}
      <SpeedDial
        icon={<SpeedDialIcon />}
        direction="down"
        ariaLabel="إجراءات سريعة"
      >
        <SpeedDialAction
          icon={<AddTaskIcon />}
          tooltipTitle="مهمة جديدة"
          onClick={handleAddTask}
        />
        <SpeedDialAction
          icon={<MeetingIcon />}
          tooltipTitle="اجتماع جديد"
          onClick={handleAddMeeting}
        />
        <SpeedDialAction
          icon={<NoteIcon />}
          tooltipTitle="ملاحظة جديدة"
          onClick={handleAddNote}
        />
      </SpeedDial>

      {/* أزرار التنقل السريع */}
      <QuickNavigation>
        <IconButton onClick={() => scrollToTop()}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton onClick={() => toggleFullscreen()}>
          <FullscreenIcon />
        </IconButton>
      </QuickNavigation>
    </ActionsContainer>
  );
}; 