package com.njfu.wa.sys.mapper;

import com.njfu.wa.sys.domain.Block;
import com.njfu.wa.sys.domain.Crop;
import com.njfu.wa.sys.domain.Field;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FieldMapperTest {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private FieldMapper fieldMapper;

    @Test
    public void selectFields() throws Exception {
        Field field = new Field();
        field.setBlock(new Block(null));
        field.setCrop(new Crop(null));
        List<Field> fields = fieldMapper.selectFields(field);
        log.info("fields : {}", fields);
    }

}