package ro.tuc.ds2020.dtos.builders;


import ro.tuc.ds2020.dtos.ProgramDTO;
import ro.tuc.ds2020.entities.Program;

public class ProgramBuilder {

    private ProgramBuilder() {}

    public static ProgramDTO toDTO(Program program) {
        return new ProgramDTO(
                program.getId(),
                program.getDay(),
                program.getStartProgram(),
                program.getEndProgram(),
                program.getUser().getId()
        );
    }
}
