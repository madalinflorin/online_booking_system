package ro.tuc.ds2020.entities;

import java.util.Calendar;

public class HelperProgram {
    private Calendar startProgram;
    private Calendar endProgram;

    public HelperProgram(){

    }

    public HelperProgram(Calendar startProgram, Calendar endProgram){
        this.startProgram = startProgram;
        this.endProgram = endProgram;
    }

    public Calendar getStartProgram() {
        return startProgram;
    }

    public void setStartProgram(Calendar startProgram) {
        this.startProgram = startProgram;
    }

    public Calendar getEndProgram() {
        return endProgram;
    }

    public void setEndProgram(Calendar endProgram) {
        this.endProgram = endProgram;
    }
}
